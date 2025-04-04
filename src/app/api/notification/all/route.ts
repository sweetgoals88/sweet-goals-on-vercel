// Gets all notifications of a user (either admin or customer)

import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";
import { parseEntity } from "../../db/parse-entity";
import { NotificationEntity } from "../../db/entities/notification-entity";

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

        const notificationsQuery = query(
            FirebaseConfiguration.NOTIFICATIONS,
            where("userId", "==", userId)
        );
        const notificationsSnapshot = await getDocsFromServer(notificationsQuery);

        if (notificationsSnapshot.empty) {
            return NextResponse.json({ success: true, notifications: [] });
        }

        const notifications = notificationsSnapshot.docs.map((doc) =>
            parseEntity<NotificationEntity>(doc)
        );

        return NextResponse.json({ success: true, notifications });
    } catch (error: any) {
        return makeErrorResponse("Couldn't fetch notifications", 500, error);
    }
}