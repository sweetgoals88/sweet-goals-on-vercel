// Gets the last internal reading measured by the prototype of the user. It
// uses the date of the last reading received by the caller to get the next
// reading to return. If the date is not passed, it returns the last reading.
// If the date is passed, it returns the next reading after that date. Only 
// customers can use this endpoint and they must be logged in

import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, orderBy, limit, getDocsFromServer, documentId, getDocs, getDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { InternalReadingEntity } from "../../db/entities/internal-reading/entity";
import { CustomerEntity } from "../../db/entities/user/entity";


export async function GET(request: NextRequest) {
    try {
        const userSnapshot = await authenticateUser(() => cookies(), { requiredType: "customer" });

        const body = JSON.parse(await request.text());
        const { prototypeId, newestReading } = body;

        if (!prototypeId) {
            // throw new ApiResponseError();
            // return makeErrorResponse("Prototype ID is required", 400);
        }

        const userData = userSnapshot.data() as CustomerEntity;
        if (userData.prototypes.indexOf(prototypeId) === -1) {
            return makeErrorResponse("The prototype does not belong to the user", 403);
        }

        let lastReadingQuery;
        if (newestReading !== undefined) {
            const readingQuery = query(
                FirebaseConfiguration.INTERNAL_READING,
                where(documentId(), "==", newestReading)
            );
            const readingSnapshot = await getDocs(readingQuery);
            const reading = readingSnapshot.docs[0]?.data() as InternalReadingEntity;
    
            const lastReadingDate = reading.datetime;
            lastReadingQuery = query(
                FirebaseConfiguration.INTERNAL_READING,
                where("prototypeId", "==", prototypeId),
                where("timestamp", ">", lastReadingDate),
                orderBy("timestamp", "asc"),
                limit(1)
            );
        } else {
            lastReadingQuery = query(
                FirebaseConfiguration.INTERNAL_READING,
                where("prototypeId", "==", prototypeId),
                orderBy("timestamp", "asc"),
                limit(1)
            );
        }

        const lastReadingSnapshot = await getDocs(lastReadingQuery);
        const lastReading = lastReadingSnapshot.docs[0].data() as InternalReadingEntity;

        return NextResponse.json({ lastReading });
    } catch (error: any) {
        return makeErrorResponse("Couldn't fetch the last internal reading", 500, error);
    }
}