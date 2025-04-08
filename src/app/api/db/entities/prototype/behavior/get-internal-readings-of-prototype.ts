import {
  documentId,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { InternalReadingPreview } from "../../internal-reading/preview";
import { PrototypeEntity } from "../entity";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { InternalReadingEntity } from "../../internal-reading/entity";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import splitArray from "@/utils/split-array";

export async function getInternalReadingsOfPrototype(
  prototype: PrototypeEntity
): Promise<[InternalReadingPreview[], string | null]> {
  try {
    if (
      prototype.internal_readings === undefined ||
      prototype.internal_readings.length === 0
    ) {
      return [[], null];
    }

    const chunksOfInternalReadings = await Promise.all(
      splitArray(prototype.internal_readings, 30).map((slice) =>
        getDocs(
          query(
            FirebaseConfiguration.INTERNAL_READING,
            where(documentId(), "in", slice),
          )
        ).then((internalReadingsSnapshot) =>
          internalReadingsSnapshot.docs.map((reading) => {
            const data = reading.data() as InternalReadingEntity;
            return {
              id: reading.id,
              dateTime: data.datetime.toDate(),
              humidity: data.humidity,
              temperature: data.temperature,
            } as InternalReadingPreview;
          })
        )
      )
    );

    const internalReadings = chunksOfInternalReadings.flat().slice(0, 20).toSorted((a, b) => a.dateTime.getMilliseconds() - b.dateTime.getMilliseconds());

    const oldestInternalReading = internalReadings.length
      ? internalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b)).id
      : null;

    return [internalReadings, oldestInternalReading];
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Couldn't get the prototype's internal readings",
      error,
      500
    );
  }
}
