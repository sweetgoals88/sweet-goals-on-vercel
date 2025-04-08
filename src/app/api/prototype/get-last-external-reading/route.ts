// Gets the last external reading measured by the prototype of the user. It
// uses the date of the last reading received by the caller to get the next
// reading to return. If the date is not passed, it returns the last reading.
// If the date is passed, it returns the next reading after that date. Only
// customers can use this endpoint and they must be logged in

import { NextRequest, NextResponse } from "next/server";
import {
  query,
  where,
  orderBy,
  limit,
  getDocsFromServer,
  doc,
  getDoc,
  documentId,
  getDocs,
} from "firebase/firestore";
import { verifyJwt } from "@/app/api/lib/jwt";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { makeErrorResponse } from "../../lib/make-error-response";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { PrototypeEntity } from "../../db/entities/prototype/entity";
import { ExternalReadingEntity } from "../../db/entities/external-reading/entity";

export async function POST(request: NextRequest) {
  try {
    const userSnapshot = await authenticateUser(() => cookies(), {
      requiredType: "customer",
    });

    const { prototypeId, lastReadingId } = JSON.parse(await request.text());

    if (prototypeId === undefined || prototypeId.length == 0) {
      return makeErrorResponse("Prototype ID is required", 400);
    }

    if (lastReadingId === undefined) {
      return makeErrorResponse(
        "Last reading ID is required (even if it is blank)",
        400
      );
    }

    const prototypeReferece = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
    const prototypeSnapshot = await getDoc(prototypeReferece);
    const prototype = prototypeSnapshot.data() as PrototypeEntity;

    let externalReadings;

    if (prototype.external_readings.length < 30) {
      const _query = query(
        FirebaseConfiguration.EXTERNAL_READING,
        where(documentId(), "in", prototype.external_readings),
        orderBy("datetime", "desc"),
      );
      const snapshot = getDocs(_query);
    } else {
      externalReadings = await Promise.all(
        prototype.external_readings.map(async (externalReadingId) => {
          const externalReadingReference = doc(
            FirebaseConfiguration.EXTERNAL_READING,
            externalReadingId
          );
          const externalReadingSnapshot = await getDoc(
            externalReadingReference
          );
          const externalReading =
            externalReadingSnapshot.data() as ExternalReadingEntity;
          return externalReading;
        })
      );
      // const recentReadings = externalReadings.filter(reading => reading.datetime);
      // externalReadings.sort((a, b) => a.datetime.toMillis() - b.datetime.toMillis());
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return makeErrorResponse(
      "Couldn't fetch the last external reading",
      500,
      error
    );
  }
}
