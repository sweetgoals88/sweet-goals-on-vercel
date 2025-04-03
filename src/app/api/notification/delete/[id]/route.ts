import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../../db/firebase-configuration";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Deletes a user's notification (either admin or customer)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

        const notificationId = params.id;
        if (!notificationId) {
            return makeErrorResponse("Notification ID is required", 400);
        }

        const notificationRef = doc(FirebaseConfiguration.NOTIFICATIONS, notificationId);
        const notificationDoc = await getDoc(notificationRef);

        if (!notificationDoc.exists()) {
            return makeErrorResponse("Notification not found", 404);
        }

        const notificationData = notificationDoc.data();
        if (notificationData.userId !== userId) {
            return makeErrorResponse("You are not authorized to delete this notification", 403);
        }

        await deleteDoc(notificationRef);

        return NextResponse.json({ success: true, message: "Notification deleted successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the notification", 500, error);
    }
}