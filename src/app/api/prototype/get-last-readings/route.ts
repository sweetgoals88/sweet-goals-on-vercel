// Gets the last external reading measured by the prototype of the user. It
// uses the date of the last reading received by the caller to get the next
// reading to return. If the date is not passed, it returns the last reading.
// If the date is passed, it returns the next reading after that date. Only
// customers can use this endpoint and they must be logged in

import { NextRequest, NextResponse } from "next/server";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { makeErrorResponse } from "../../lib/make-error-response";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { PrototypeEntity } from "../../db/entities/prototype/entity";
import { ApiResponseError } from "../../lib/api-response-error";
import { getExternalReadingsAfterLastReading } from "../../db/entities/prototype/behavior/get-external-readings-after-last-reading";
import { getInternalReadingsAfterLastReading } from "../../db/entities/prototype/behavior/get-internal-readings-after-last-reading";

export async function POST(request: NextRequest) {
  try {
    await authenticateUser(() => cookies(), {
      requiredType: "customer",
    });

    const { prototypeId, lastExternalReading, lastInternalReading } = JSON.parse(await request.text());

    if (prototypeId === undefined || prototypeId.length == 0) {
      throw new ApiResponseError("Prototype ID is required", 400);
    }

    if (lastInternalReading === undefined) {
      throw new ApiResponseError(
        "Last internal reading ID is required (even if it is blank)",
        400
      );
    }

    if (lastExternalReading === undefined) {
      throw new ApiResponseError(
        "Last external reading ID is required (even if it is blank)",
        400
      );
    }

    const prototypeReference = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
    const prototypeSnapshot = await getDoc(prototypeReference);
    if (!prototypeSnapshot.exists()) {
        throw new ApiResponseError("The prototype id is not valid", 400);
    }
    const prototype = prototypeSnapshot.data() as PrototypeEntity;

    const [ internalReadings, externalReadings ] = await Promise.all([
        getInternalReadingsAfterLastReading(prototype, lastInternalReading === ""? null: lastInternalReading),
        getExternalReadingsAfterLastReading(prototype, lastExternalReading === ""? null: lastExternalReading)
    ]);

    const nextLastInternalReading = internalReadings.length > 0? internalReadings[internalReadings.length - 1]: null;
    const nextLastExternalReading = externalReadings.length > 0? externalReadings[externalReadings.length - 1]: null;

    return NextResponse.json({ 
        externalReadings, 
        internalReadings, 
        nextLastExternalReading ,
        nextLastInternalReading, 
    });
  } catch (error: any) {
    return makeErrorResponse(
      "Couldn't fetch the last external reading",
      500,
      error
    );
  }
}
