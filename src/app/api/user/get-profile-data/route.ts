// Gets information about the user (either an admin or customer) to be used
// in the admin's dashboard

import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";
import { parseEntity } from "../../db/parse-entity";
import { UserEntity } from "../../db/entities/user-entity";

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

        const userQuery = query(FirebaseConfiguration.USER, where("_id", "==", userId));
        const userSnapshot = await getDocsFromServer(userQuery);

        if (userSnapshot.empty) {
            return makeErrorResponse("User not found", 404);
        }

        const userData = parseEntity<UserEntity>(userSnapshot.docs[0]);

        return NextResponse.json({ success: true, user: userData });
    } catch (error: any) {
        return makeErrorResponse("Couldn't fetch user profile data", 500, error);
    }
}