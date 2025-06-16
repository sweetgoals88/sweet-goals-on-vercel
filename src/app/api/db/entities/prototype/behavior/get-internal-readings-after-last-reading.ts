import { FirebaseConfiguration } from "../../../firebase-configuration";
import { InternalReadingEntity } from "../../internal-reading/entity";
import { InternalReadingPreview } from "../../internal-reading/preview";
import { PrototypeEntity } from "../entity";
import { getReadingsAfterLastReading } from "./_get-readings-after-last-reading";

export async function getInternalReadingsAfterLastReading(
  prototype: PrototypeEntity,
  lastReadingId: string | null
): Promise<[InternalReadingPreview[], string | null]> {
  return getReadingsAfterLastReading<InternalReadingEntity, InternalReadingPreview>(
    prototype.internal_readings,
    lastReadingId,
    FirebaseConfiguration.INTERNAL_READING,
    (reading) => ({
      id: reading.id,
      dateTime: reading.datetime.toDate(),
      temperature: reading.temperature,
      humidity: reading.humidity,
    })
  );
}
