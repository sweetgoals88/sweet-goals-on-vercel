import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer, updateDoc, deleteDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";

// Deletes the account of a user (either an admin or customer); only allowed
// for admins. When their accounts are deleted, regular users' prototypes are
// marked as unactive and their API key and activation code are eliminated 
// from the database. When admins are deleted, the admins they invited are
// transferred to the admin who deleted the original admin (i. e., if admin A
// invited admin B and C, and admin D deletes A's account, then B and C are 
// transferred to D). Admins can delete any customer, but if they want to 
// delete an admin, they must be the one who invited them.

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

        const { userIdToDelete } = await request.json();
        if (!userIdToDelete) {
            return makeErrorResponse("User ID to delete is required", 400);
        }

        const currentUserQuery = query(FirebaseConfiguration.USER, where("_id", "==", userPayload._id));
        const currentUserSnapshot = await getDocsFromServer(currentUserQuery);

        if (currentUserSnapshot.empty) {
            return makeErrorResponse("Current user not found", 404);
        }

        const currentUser = currentUserSnapshot.docs[0].data();
        if (currentUser.type !== "admin") {
            return makeErrorResponse("Only admins can delete accounts", 403);
        }

        const userToDeleteQuery = query(FirebaseConfiguration.USER, where("_id", "==", userIdToDelete));
        const userToDeleteSnapshot = await getDocsFromServer(userToDeleteQuery);

        if (userToDeleteSnapshot.empty) {
            return makeErrorResponse("User to delete not found", 404);
        }

        const userToDelete = userToDeleteSnapshot.docs[0].data();

        if (userToDelete.type === "admin" && userToDelete.invitedBy !== currentUser._id) {
            return makeErrorResponse("Admins can only delete admins they invited", 403);
        }

        if (userToDelete.type === "customer") {
            // Marcar prototipos como inactivos y eliminar claves API y códigos de activación
            const prototypesQuery = query(FirebaseConfiguration.PROTOTYPE, where("userId", "==", userIdToDelete));
            const prototypesSnapshot = await getDocsFromServer(prototypesQuery);

            for (const prototypeDoc of prototypesSnapshot.docs) {
                await updateDoc(prototypeDoc.ref, { active: false, apiKey: null, activationCode: null });
            }
        } else if (userToDelete.type === "admin") {
            // Transferir admins invitados al admin actual
            const invitedAdminsQuery = query(FirebaseConfiguration.USER, where("invitedBy", "==", userIdToDelete));
            const invitedAdminsSnapshot = await getDocsFromServer(invitedAdminsQuery);

            for (const invitedAdminDoc of invitedAdminsSnapshot.docs) {
                await updateDoc(invitedAdminDoc.ref, { invitedBy: currentUser._id });
            }
        }

        // Eliminar la cuenta del usuario
        await deleteDoc(userToDeleteSnapshot.docs[0].ref);

        return NextResponse.json({ success: true, message: "User account deleted successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the user account", 500, error);
    }
}