import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer, updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Updates the user profile with the new data given
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

        const { name, email, otherFields } = body; // Replace `otherFields` with actual fields to update
        if (!name && !email && !otherFields) {
            return makeErrorResponse("At least one field to update is required", 400);
        }

        const userQuery = query(FirebaseConfiguration.USER, where("_id", "==", userId));
        const userSnapshot = await getDocsFromServer(userQuery);

        if (userSnapshot.empty) {
            return makeErrorResponse("User not found", 404);
        }

        const userDocRef = userSnapshot.docs[0].ref;

        // Actualizar los campos proporcionados
        const updates: Record<string, any> = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (otherFields) Object.assign(updates, otherFields);

        await updateDoc(userDocRef, updates);

        return NextResponse.json({ success: true, message: "User profile updated successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't update the user profile", 500, error);
    }
}