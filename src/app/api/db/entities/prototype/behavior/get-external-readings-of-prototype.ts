import { documentId, getDocs, limit, orderBy, query, where, doc, getDoc } from "firebase/firestore";
import { ExternalReadingPreview } from "../../external-reading/preview";
import { PrototypeEntity } from "../entity";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ExternalReadingEntity } from "../../external-reading/entity";
import { panelSpecificationsEntityToPreview } from "../preview";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { parseEntity } from "../../../parse-entity";

export async function getExternalReadingsOfPrototype(prototype: PrototypeEntity): Promise<[ExternalReadingPreview[], string | null]> {
  try {
    if (prototype.external_readings === undefined || prototype.external_readings.length === 0) {
      return [ [], null ];
    }
  
    const externalReadingsSnapshot = await getDocs(
      query(
        FirebaseConfiguration.EXTERNAL_READING,
        where(documentId(), "in", prototype.external_readings),
        orderBy("datetime", "asc"),
        limit(20)
      )
    );
  
    const externalReadings: ExternalReadingPreview[] =
    externalReadingsSnapshot.docs.map((reading) => {
      const data = reading.data() as ExternalReadingEntity;
      return {
        id: reading.id,
        dateTime: data.datetime.toDate(),
        light: data.light,
        temperature: data.temperature,
        current: data.current,
        voltage: data.voltage,
        wattage: data.wattage,
        panelSpecifications: panelSpecificationsEntityToPreview(data.panel_specifications),
      };
    });
  
    const oldestExternalReading = externalReadings.length
      ? externalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
          .id
      : null;
    
    return [ externalReadings, oldestExternalReading ]
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the prototype's external readings", error, 500);
  }
}

type ExternalReadingEntityWithId = ExternalReadingEntity & { id: string };

export async function getReadingsAfterLastReading(
  prototype: PrototypeEntity,
  lastReadingId: string | null
): Promise<ExternalReadingPreview[]> {
  try {
    if (!prototype.external_readings || prototype.external_readings.length === 0) {
      return [];
    }

    let lastReadingDate: Date | null = null;

    if (lastReadingId) {
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
          orderBy("datetime", "asc")
        )
      );
      externalReadings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ExternalReadingEntityWithId));
    } else {
      externalReadings = await Promise.all(
        prototype.external_readings.map(async (id) => {
          const docRef = doc(FirebaseConfiguration.EXTERNAL_READING, id);
          const snapshot = await getDoc(docRef);
          return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as ExternalReadingEntityWithId) : null;
        })
      ).then(readings => readings.filter(Boolean) as ExternalReadingEntityWithId[]);
    }

    externalReadings.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());

    const filteredReadings = lastReadingDate
      ? externalReadings.filter(reading => reading.datetime.toDate() > lastReadingDate)
      : externalReadings;

    return filteredReadings.map(reading => ({
      id: reading.id,
      dateTime: reading.datetime.toDate(),
      light: reading.light,
      temperature: reading.temperature,
      current: reading.current,
      voltage: reading.voltage,
      wattage: reading.wattage,
      panelSpecifications: panelSpecificationsEntityToPreview(reading.panel_specifications),
    }));
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't fetch readings after the last reading", error, 500);
  }
}