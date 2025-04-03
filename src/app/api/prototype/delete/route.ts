import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../../db/firebase-configuration";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Delete the prototype with the id given for the logged in user. Only for customers (not admins).
// When deleted, the prototype is not deleted from the database, but only unlinked from the 
// user's account so that they can't access it anymore; all readings are deleted too, as well
// as panel specifications and user customization

export async function DELETE(request: NextRequest) {
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
            return makeErrorResponse("Only customers can delete prototypes", 403);
        }

        let body;
        try {
            body = JSON.parse(await request.text());
        } catch (error) {
            return makeErrorResponse("Invalid JSON body", 400);
        }

        const { prototypeId } = body;
        if (!prototypeId) {
            return makeErrorResponse("Prototype ID is required", 400);
        }

        const prototypeRef = doc(FirebaseConfiguration.PROTOTYPE, prototypeId);
        const prototypeDoc = await getDoc(prototypeRef);

        if (!prototypeDoc.exists()) {
            return makeErrorResponse("Prototype not found", 404);
        }

        const prototypeData = prototypeDoc.data();
        if (prototypeData.userId !== userId) {
            return makeErrorResponse("You are not authorized to delete this prototype", 403);
        }

        // Desvincular el prototipo del usuario
        await updateDoc(prototypeRef, { userId: null });

        // Eliminar lecturas, especificaciones de panel y personalización del usuario
        const readingsRef = doc(FirebaseConfiguration.READINGS, prototypeId);
        const panelSpecsRef = doc(FirebaseConfiguration.PANEL_SPECS, prototypeId);
        const customizationRef = doc(FirebaseConfiguration.CUSTOMIZATION, prototypeId);

        await deleteDoc(readingsRef);
        await deleteDoc(panelSpecsRef);
        await deleteDoc(customizationRef);

        return NextResponse.json({ success: true, message: "Prototype unlinked successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the prototype", 500, error);
    }
}
