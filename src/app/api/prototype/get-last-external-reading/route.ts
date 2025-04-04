// Gets the last external reading measured by the prototype of the user. It
// uses the date of the last reading received by the caller to get the next
// reading to return. If the date is not passed, it returns the last reading.
// If the date is passed, it returns the next reading after that date. Only 
// customers can use this endpoint and they must be logged in

import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../../db/firebase-configuration";
import { query, where, orderBy, limit, getDocsFromServer } from "firebase/firestore";
import { makeErrorResponse } from "../../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return makeErrorResponse("Authorization token is required", 401);
        }

        let userPayload;
        try {
            userPayload = await verifyJwt(token);
        } catch (error) {
            return makeErrorResponse("Invalid or expired token", 401);
        }

        const userId = userPayload._id;
        if (!userId) {
            return makeErrorResponse("Invalid user ID in token", 400);
        }

        if (userPayload.type !== "customer") {
            return makeErrorResponse("Only customers can access this endpoint", 403);
        }

        const { searchParams } = new URL(request.url);
        const prototypeId = searchParams.get("prototypeId");
        const lastReadingDate = searchParams.get("lastReadingDate");

        if (!prototypeId) {
            return makeErrorResponse("Prototype ID is required", 400);
        }

        const readingsQuery = query(
            FirebaseConfiguration.READINGS,
            where("prototypeId", "==", prototypeId),
            ...(lastReadingDate
                ? [where("timestamp", ">", new Date(lastReadingDate))]
                : []),
            orderBy("timestamp", "asc"),
            limit(1)
        );

        const readingsSnapshot = await getDocsFromServer(readingsQuery);

        if (readingsSnapshot.empty) {
            return NextResponse.json({ success: true, reading: null });
        }

        const reading = readingsSnapshot.docs[0].data();

        return NextResponse.json({ success: true, reading });
    } catch (error: any) {
        return makeErrorResponse("Couldn't fetch the last external reading", 500, error);
    }
}