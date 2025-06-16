import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { doc, getDoc, getDocs, query, where, documentId, orderBy, limit } from "firebase/firestore";
import { InternalReadingEntity } from "../../internal-reading/entity";
import { ExternalReadingEntity } from "../../external-reading/entity";

type ReadingEntityWithId<T> = T & { id: string };

export async function getReadingsAfterLastReading<T extends InternalReadingEntity | ExternalReadingEntity, P>(
  prototypeReadings: string[] | undefined | null,
  lastReadingId: string | null,
  firebaseCollection: any,
  transformToPreview: (reading: ReadingEntityWithId<T>) => P,
  limitResults: number = 20
): Promise<[P[], string | null]> {
  try {
    if (!prototypeReadings || prototypeReadings.length === 0) {
      return [[], null];
    }

    let lastReadingDate: Date | null = null;

    if (lastReadingId !== null) {
      const lastReadingRef = doc(firebaseCollection, lastReadingId);
      const lastReadingSnapshot = await getDoc(lastReadingRef);

      if (lastReadingSnapshot.exists()) {
        const lastReadingData = lastReadingSnapshot.data() as T;
        lastReadingDate = lastReadingData.datetime.toDate();
      } else {
        throw new ApiResponseError(`Invalid lastReadingId: ${lastReadingId}`, 400);
      }
    }

    let readings: ReadingEntityWithId<T>[] = [];

    if (prototypeReadings.length <= 30) {
      const snapshot = await getDocs(
        query(
          firebaseCollection,
          where(documentId(), "in", prototypeReadings),
          orderBy("datetime", "asc"),
          limit(limitResults)
        )
      );
      readings = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as object) } as ReadingEntityWithId<T>));
    } else {
      readings = await Promise.all(
        prototypeReadings.map(async (id) => {
          const docRef = doc(firebaseCollection, id);
          const snapshot = await getDoc(docRef);
          return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ReadingEntityWithId<T>) : null;
        })
      ).then(readings => readings.filter(Boolean) as ReadingEntityWithId<T>[]);
    }

    const filteredReadings = lastReadingDate
      ? readings.filter(reading => (reading as any).datetime.toDate() > lastReadingDate)
      : readings;

    filteredReadings.sort((a, b) => (a as any).datetime.toMillis() - (b as any).datetime.toMillis());

    const newLastReadingId = filteredReadings.length > 0 ? filteredReadings[filteredReadings.length - 1].id : null;

    return [
      filteredReadings.map(transformToPreview),
      newLastReadingId
    ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't fetch readings after the last reading", error, 500);
  }
}