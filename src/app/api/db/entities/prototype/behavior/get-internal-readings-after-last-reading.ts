import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { doc, getDoc, getDocs, query, where, documentId, orderBy } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { InternalReadingEntity } from "../../internal-reading/entity";
import { InternalReadingPreview } from "../../internal-reading/preview";
import { PrototypeEntity } from "../entity";

type InternalReadingEntityWithId = InternalReadingEntity & { id: string };

export async function getInternalReadingsAfterLastReading(
  prototype: PrototypeEntity,
  lastReadingId: string | null
): Promise<InternalReadingPreview[]> {
  try {
    if (!prototype.internal_readings || prototype.internal_readings.length === 0) {
      return [];
    }

    let lastReadingDate: Date | null = null;

    if (lastReadingId) {
      const lastReadingRef = doc(FirebaseConfiguration.INTERNAL_READING, lastReadingId);
      const lastReadingSnapshot = await getDoc(lastReadingRef);

      if (lastReadingSnapshot.exists()) {
        const lastReadingData = lastReadingSnapshot.data() as InternalReadingEntity;
        lastReadingDate = lastReadingData.datetime.toDate();
      } else {
        throw new ApiResponseError(`Invalid lastReadingId: ${lastReadingId}`, 400);
      }
    }

    let internalReadings: InternalReadingEntityWithId[] = [];

    if (prototype.internal_readings.length <= 30) {
      const snapshot = await getDocs(
        query(
          FirebaseConfiguration.INTERNAL_READING,
          where(documentId(), "in", prototype.internal_readings),
          orderBy("datetime", "asc")
        )
      );
      internalReadings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InternalReadingEntityWithId));
    } else {
      internalReadings = await Promise.all(
        prototype.internal_readings.map(async (id) => {
          const docRef = doc(FirebaseConfiguration.INTERNAL_READING, id);
          const snapshot = await getDoc(docRef);
          return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as InternalReadingEntityWithId) : null;
        })
      ).then(readings => readings.filter(Boolean) as InternalReadingEntityWithId[]);
    }

    internalReadings.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());

    const filteredReadings = lastReadingDate
      ? internalReadings.filter(reading => reading.datetime.toDate() > lastReadingDate)
      : internalReadings;

    return filteredReadings.map(reading => ({
      id: reading.id,
      dateTime: reading.datetime.toDate(),
      temperature: reading.temperature,
      humidity: reading.humidity,
    }));
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't fetch readings after the last reading", error, 500);
  }
}