// Updates the properties of the prototype with the new data given. Only
// for customers (not for admins)

import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../../db/firebase-configuration";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

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

        if (userPayload.type !== "customer") {
            return makeErrorResponse("Only customers can edit prototypes", 403);
        }

        let body;
        try {
            body = JSON.parse(await request.text());
        } catch (error) {
            return makeErrorResponse("Invalid JSON body", 400);
        }

        const { prototypeId, updates } = body;
        if (!prototypeId || !updates || typeof updates !== "object") {
            return makeErrorResponse("Prototype ID and valid updates are required", 400);
        }

        const prototypeRef = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
        const prototypeDoc = await getDoc(prototypeRef);

        if (!prototypeDoc.exists()) {
            return makeErrorResponse("Prototype not found", 404);
        }

        const prototypeData = prototypeDoc.data();
        if (prototypeData.userId !== userId) {
            return makeErrorResponse("You are not authorized to edit this prototype", 403);
        }

        await updateDoc(prototypeRef, updates);

        return NextResponse.json({ success: true, message: "Prototype updated successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't update the prototype", 500, error);
    }
}