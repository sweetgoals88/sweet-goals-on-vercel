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
): Promise<[ InternalReadingPreview[], string | null ]> {
  try {
    if (
      prototype.external_readings === undefined || 
      prototype.external_readings === null || 
      prototype.external_readings.length === 0
    ) {
      return [ [], null ];
    }

    let lastReadingDate: Date | null = null;

    if (lastReadingId !== null) {
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
          // @review I should probably throw an error in case the reading doesn't exist
        })
      ).then(readings => readings.filter(Boolean) as InternalReadingEntityWithId[]);
    }
    
    const filteredReadings = lastReadingDate
    ? internalReadings.filter(reading => reading.datetime.toDate() > lastReadingDate)
    : internalReadings;

    filteredReadings.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());
    // @todo Consider a limit in the number of readings provided (20 sounds like good enough)

    const newLastReadingId = filteredReadings.length > 0 ? filteredReadings[filteredReadings.length - 1].id : null;

    return [ 
      filteredReadings.map(reading => ({
        id: reading.id,
        dateTime: reading.datetime.toDate(),
        temperature: reading.temperature,
        humidity: reading.humidity,
      })),
      newLastReadingId
    ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't fetch readings after the last reading", error, 500);
  }
}