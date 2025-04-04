import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer, deleteDoc, updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Deletes the account of the user themselves (i. e., the use who wants to 
// delete their account must be the one to call this endpoint)

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

        const userQuery = query(FirebaseConfiguration.USER, where("_id", "==", userId));
        const userSnapshot = await getDocsFromServer(userQuery);

        if (userSnapshot.empty) {
            return makeErrorResponse("User not found", 404);
        }

        const user = userSnapshot.docs[0].data();

        if (user.type === "customer") {
            // Marcar prototipos como inactivos y eliminar claves API y códigos de activación
            const prototypesQuery = query(FirebaseConfiguration.PROTOTYPE, where("userId", "==", userId));
            const prototypesSnapshot = await getDocsFromServer(prototypesQuery);

            for (const prototypeDoc of prototypesSnapshot.docs) {
                await updateDoc(prototypeDoc.ref, { active: false, apiKey: null, activationCode: null });
            }
        }

        // Eliminar la cuenta del usuario
        await deleteDoc(userSnapshot.docs[0].ref);

        return NextResponse.json({ success: true, message: "User account deleted successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the user account", 500, error);
    }
}