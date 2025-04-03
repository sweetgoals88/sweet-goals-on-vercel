import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../../db/firebase-configuration";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Marks a notification as "seen" or "not-seen". Only those two exact strings
// are allowed as values for the "status" parameter. When marked as "seen",
// the notification's seen_at field is set to the current date and time.
// When marked as "not-seen", the notification's seen_at field is deleted.
// This endpoint requires the notification's id, which must correspond to
// the user's notification list. The user must be authenticated

export async function PUT(request: NextRequest) {
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

        let body;
        try {
            body = JSON.parse(await request.text());
        } catch (error) {
            return makeErrorResponse("Invalid JSON body", 400);
        }

        const { notificationId, status } = body;
        if (!notificationId || !status) {
            return makeErrorResponse("Notification ID and status are required", 400);
        }

        if (status !== "seen" && status !== "not-seen") {
            return makeErrorResponse('Status must be either "seen" or "not-seen"', 400);
        }

        const notificationRef = doc(FirebaseConfiguration.NOTIFICATIONS, notificationId);
        const notificationDoc = await getDoc(notificationRef);

        if (!notificationDoc.exists()) {
            return makeErrorResponse("Notification not found", 404);
        }

        const notificationData = notificationDoc.data();
        if (notificationData.userId !== userId) {
            return makeErrorResponse("You are not authorized to update this notification", 403);
        }

        const updates: Record<string, any> = {};
        if (status === "seen") {
            updates.seen_at = new Date().toISOString();
        } else if (status === "not-seen") {
            updates.seen_at = null;
        }

        await updateDoc(notificationRef, updates);

        return NextResponse.json({ success: true, message: `Notification marked as ${status}` });
    } catch (error: any) {
        return makeErrorResponse("Couldn't update the notification status", 500, error);
    }
}