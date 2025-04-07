import { documentId, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ExternalReadingPreview } from "../../external-reading/preview";
import { PrototypeEntity } from "../entity";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ExternalReadingEntity } from "../../external-reading/entity";
import { panelSpecificationsEntityToPreview } from "../preview";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function getExternalReadingsOfPrototype(prototype: PrototypeEntity): Promise<[ExternalReadingPreview[], string | null]> {
  try {
    if (prototype.external_readings === undefined || prototype.external_readings.length === 0) {
      return [ [], null ];
    }
  
    const externalReadingsSnapshot = await getDocs(
      query(
        FirebaseConfiguration.EXTERNAL_READING,
        where(documentId(), "in", prototype.external_readings),
        orderBy("datetime", "desc"),
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