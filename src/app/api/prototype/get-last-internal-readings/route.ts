import { doc, getDoc } from "firebase/firestore";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { getInternalReadingsAfterLastReading } from "../../db/entities/prototype/behavior/get-internal-readings-after-last-reading";
import { PrototypeEntity } from "../../db/entities/prototype/entity";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { ApiResponseError } from "../../lib/api-response-error";
import { authenticateUser } from "../../lib/authenticate-user";
import { makeErrorResponse } from "../../lib/make-error-response";
import makeOkResponse from "../../lib/ok-response";
import { InternalReadingPreview } from "../../db/entities/internal-reading/preview";
import { ExternalReadingPreview } from "../../db/entities/external-reading/preview";

export type GetLastReadingsResponse<
  K extends InternalReadingPreview | ExternalReadingPreview
> = {
  prototypeId: string;
  readings: K[];
  newLastReading: string | null;
}[];

export type GetLastReadingsParams = {
  prototypeId: string;
  lastReadingId: string | null;
}[];

export async function POST(request: NextRequest) {
  try {
    await authenticateUser(() => cookies(), {
      requiredType: "customer",
    });

    const lastReadingIds: GetLastReadingsParams = JSON.parse(
      await request.text()
    );

    lastReadingIds.forEach((object, index) => {
      if (object.prototypeId === undefined) {
        throw new ApiResponseError(
          `Prototype id is required in all items. It was missing in element ${index}`,
          400
        );
      }
      if (object.lastReadingId === undefined) {
        throw new ApiResponseError(
          `Last reading id is required in all items. It was missing in element ${index}`,
          400
        );
      }
    });

    return makeOkResponse(
      (await Promise.all(
        lastReadingIds.map(async ({ prototypeId, lastReadingId }, index) => {
          const prototypeReference = doc(
            FirebaseConfiguration.PROTOTYPE,
            prototypeId
          );
          const prototypeSnapshot = await getDoc(prototypeReference);
          if (!prototypeSnapshot.exists()) {
            throw new ApiResponseError(
              `The prototype id is not valid in item ${index}`,
              400
            );
          }
          const prototype = prototypeSnapshot.data() as PrototypeEntity;
          const [readings, newLastReading] =
            await getInternalReadingsAfterLastReading(prototype, lastReadingId);

          return {
            prototypeId,
            readings,
            newLastReading,
          };
        })
      )) as GetLastReadingsResponse<InternalReadingPreview>
    );
  } catch (error: any) {
    return makeErrorResponse(
      "Couldn't fetch the last internal readings for the prototypes",
      500,
      error
    );
  }
}
