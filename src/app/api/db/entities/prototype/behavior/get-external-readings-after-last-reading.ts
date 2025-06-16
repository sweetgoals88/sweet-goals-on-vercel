import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ExternalReadingEntity } from "../../external-reading/entity";
import { ExternalReadingPreview } from "../../external-reading/preview";
import { PrototypeEntity } from "../entity";
import { panelSpecificationsEntityToPreview } from "../preview";
import { getReadingsAfterLastReading } from "./_get-readings-after-last-reading";

export async function getExternalReadingsAfterLastReading(
  prototype: PrototypeEntity,
  lastReadingId: string | null
): Promise<[ExternalReadingPreview[], string | null]> {
  return getReadingsAfterLastReading<ExternalReadingEntity, ExternalReadingPreview>(
    prototype.external_readings,
    lastReadingId,
    FirebaseConfiguration.EXTERNAL_READING,
    (reading) => ({
      id: reading.id,
      dateTime: reading.datetime.toDate(),
      light: reading.light,
      temperature: reading.temperature,
      current: reading.current,
      voltage: reading.voltage,
      wattage: reading.wattage,
      panelSpecifications: panelSpecificationsEntityToPreview(reading.panel_specifications),
    })
  );
}
