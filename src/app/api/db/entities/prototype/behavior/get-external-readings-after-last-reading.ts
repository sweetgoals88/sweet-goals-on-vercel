import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { doc, getDoc, getDocs, query, where, documentId, orderBy, limit } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ExternalReadingEntity } from "../../external-reading/entity";
import { ExternalReadingPreview } from "../../external-reading/preview";
import { PrototypeEntity } from "../entity";
import { panelSpecificationsEntityToPreview } from "../preview";

type ExternalReadingEntityWithId = ExternalReadingEntity & { id: string };

export async function getExternalReadingsAfterLastReading(
  prototype: PrototypeEntity,
  lastReadingId: string | null
): Promise<[ExternalReadingPreview[], string | null]> {
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
      const lastReadingRef = doc(FirebaseConfiguration.EXTERNAL_READING, lastReadingId);
      const lastReadingSnapshot = await getDoc(lastReadingRef);

      if (lastReadingSnapshot.exists()) {
        const lastReadingData = lastReadingSnapshot.data() as ExternalReadingEntity;
        lastReadingDate = lastReadingData.datetime.toDate();
      } else {
        throw new ApiResponseError(`Invalid lastReadingId: ${lastReadingId}`, 400);
      }
    }

    let externalReadings: ExternalReadingEntityWithId[] = [];

    if (prototype.external_readings.length <= 30) {
      const snapshot = await getDocs(
        query(
          FirebaseConfiguration.EXTERNAL_READING,
          where(documentId(), "in", prototype.external_readings),
          orderBy("datetime", "asc"),
          limit(20)
        )
      );
      externalReadings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExternalReadingEntityWithId));
    } else {
      externalReadings = await Promise.all(
        prototype.external_readings.map(async (id) => {
          const docRef = doc(FirebaseConfiguration.EXTERNAL_READING, id);
          const snapshot = await getDoc(docRef);
          return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ExternalReadingEntityWithId) : null;
          // @review I should probably throw an error in case the reading doesn't exist
        })
      ).then(readings => readings.filter(Boolean) as ExternalReadingEntityWithId[]);
    }
    
    const filteredReadings = lastReadingDate
      ? externalReadings.filter(reading => reading.datetime.toDate() > lastReadingDate)
      : externalReadings;

    filteredReadings.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());
    // @todo Consider a limit in the number of readings provided (20 sounds like good enough)

    const newLastReadingId = filteredReadings.length > 0 ? filteredReadings[filteredReadings.length - 1].id : null;

    return [ 
      filteredReadings.map(reading => ({
        id: reading.id,
        dateTime: reading.datetime.toDate(),
        light: reading.light,
        temperature: reading.temperature,
        current: reading.current,
        voltage: reading.voltage,
        wattage: reading.wattage,
        panelSpecifications: panelSpecificationsEntityToPreview(reading.panel_specifications),
      })), 
      newLastReadingId 
    ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't fetch readings after the last reading", error, 500);
  }
}