import { doc, getDoc } from "firebase/firestore";
import { ApiResponseError } from "../../lib/api-response-error";
import { PrototypeEntity } from "../../db/entities/prototype/entity";
import { InternalReadingPreview } from "../../db/entities/internal-reading/preview";
import { ExternalReadingPreview } from "../../db/entities/external-reading/preview";
import { GetLastReadingsResponse } from "./get-last-readings-types";

export async function fetchReadingsAfterLastReading<K extends InternalReadingPreview | ExternalReadingPreview>(
  lastReadingIds: { prototypeId: string; lastReadingId: string | null }[],
  firebaseCollection: any,
  getReadingsAfterLastReading: (
    prototype: PrototypeEntity,
    lastReadingId: string | null
  ) => Promise<[K[], string | null]>
): Promise<GetLastReadingsResponse<K>> {
  return Promise.all(
    lastReadingIds.map(async ({ prototypeId, lastReadingId }, index) => {
      const prototypeReference = doc(firebaseCollection, prototypeId);
      const prototypeSnapshot = await getDoc(prototypeReference);

      if (!prototypeSnapshot.exists()) {
        throw new ApiResponseError(
          `The prototype id is not valid in item ${index}`,
          400
        );
      }

      const prototype = prototypeSnapshot.data() as PrototypeEntity;
      const [readings, newLastReading] = await getReadingsAfterLastReading(
        prototype,
        lastReadingId
      );

      return {
        prototypeId,
        readings,
        newLastReading,
      };
    })
  );
}