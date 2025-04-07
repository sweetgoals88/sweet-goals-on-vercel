import { documentId, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { InternalReadingPreview } from "../../internal-reading/preview";
import { PrototypeEntity } from "../entity";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { InternalReadingEntity } from "../../internal-reading/entity";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function getInternalReadingsOfPrototype(prototype: PrototypeEntity): Promise<[InternalReadingPreview[], string | null]> {
  try {
    if (prototype.internal_readings === undefined || prototype.internal_readings.length === 0) {
      return [ [], null ];
    }
  
    const internalReadingsSnapshot = await getDocs(
      query(
        FirebaseConfiguration.INTERNAL_READING,
        where(documentId(), "in", prototype.internal_readings),
        orderBy("datetime", "desc"),
        limit(20)
      )
    );
  
    const internalReadings: InternalReadingPreview[] =
      internalReadingsSnapshot.docs.map((reading) => {
        const data = reading.data() as InternalReadingEntity;
        return {
          id: reading.id,
          dateTime: data.datetime.toDate(),
          humidity: data.humidity,
          temperature: data.temperature,
        };
      });
    
    const oldestInternalReading = internalReadings.length
    ? internalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
        .id
    : null;
    
    return [ internalReadings, oldestInternalReading ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the prototype's internal readings", error, 500);
  }
}