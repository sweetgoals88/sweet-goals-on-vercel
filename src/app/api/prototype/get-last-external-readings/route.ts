import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { authenticateUser } from "../../lib/authenticate-user";
import { makeErrorResponse } from "../../lib/make-error-response";
import makeOkResponse from "../../lib/ok-response";
import { ExternalReadingPreview } from "../../db/entities/external-reading/preview";
import { fetchReadingsAfterLastReading } from "../shared/fetch-readings-after-last-reading";
import { getExternalReadingsAfterLastReading } from "../../db/entities/prototype/behavior/get-external-readings-after-last-reading";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { ApiResponseError } from "../../lib/api-response-error";
import { GetLastReadingsParams } from "../shared/get-last-readings-types";

export async function POST(request: NextRequest) {
  try {
    await authenticateUser(() => cookies(), {
      requiredType: "customer",
    });

    const lastReadingIds = JSON.parse(await request.text()) as GetLastReadingsParams;

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

    const response = await fetchReadingsAfterLastReading<ExternalReadingPreview>(
      lastReadingIds,
      FirebaseConfiguration.PROTOTYPE,
      getExternalReadingsAfterLastReading
    );

    return makeOkResponse(response);
  } catch (error: any) {
    return makeErrorResponse(
      "Couldn't fetch the last external readings for the prototypes",
      500,
      error
    );
  }
}