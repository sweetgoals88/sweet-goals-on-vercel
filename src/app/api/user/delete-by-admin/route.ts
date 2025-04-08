import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer, updateDoc, deleteDoc, documentId, getDocs } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { ApiResponseError } from "../../lib/api-response-error";
import { AdminEntity } from "../../db/entities/user/admin/entity";
import { UserEntity } from "../../db/entities/user/entity";

// Deletes the account of a user (either an admin or customer); only allowed
// for admins. When their accounts are deleted, regular users' prototypes are
// marked as unactive and their API key and activation code are eliminated 
// from the database. When admins are deleted, the admins they invited are
// transferred to the admin who deleted the original admin (i. e., if admin A
// invited admin B and C, and admin D deletes A's account, then B and C are 
// transferred to D). Admins can delete any customer, but if they want to 
// delete an admin, they must be the one who invited them.

export async function POST(request: NextRequest) {
    try {
        const currentUserSnapshot = await authenticateUser(() => cookies(), {});
        const currentUser = currentUserSnapshot.data() as AdminEntity;

        const { userIdToDelete } = JSON.parse(await request.text());
        if (!userIdToDelete) {
            throw new ApiResponseError("User ID to delete is required", 400);
        }

        if (currentUser.type !== "admin") {
            throw new ApiResponseError("Only admins can delete accounts", 403);
        }

        const usersQuery = query(FirebaseConfiguration.USER, where(documentId(), "==", userIdToDelete));
        const usersSnapshot = await getDocsFromServer(usersQuery);

        if (usersSnapshot.empty) {
            throw new ApiResponseError("User to delete not found", 404);
        }

        const userToDeleteSnapshot = usersSnapshot.docs[0];
        const userToDelete = userToDeleteSnapshot.data() as UserEntity;

        if (userToDelete.type === "admin" && !currentUser.invited_admins.includes(userToDeleteSnapshot.id)) {
            throw new ApiResponseError("Admins can only delete admins they invited", 403);
        }

        if (userToDelete.type === "customer") {
            // Marcar prototipos como inactivos y eliminar claves API y códigos de activación
            const prototypesQuery = query(FirebaseConfiguration.PROTOTYPE, where("userId", "==", userIdToDelete));
            const prototypesSnapshot = await getDocsFromServer(prototypesQuery);

            for (const prototypeDoc of prototypesSnapshot.docs) {
                await updateDoc(prototypeDoc.ref, { active: false, operational: false });
            }
        } else if (userToDelete.type === "admin") {
            // Transferir admins invitados al admin actual
            const invitedAdminsQuery = query(FirebaseConfiguration.USER, where("invitedBy", "==", userIdToDelete));
            const invitedAdminsSnapshot = await getDocs(invitedAdminsQuery);

            for (const invitedAdminDoc of invitedAdminsSnapshot.docs) {
                await updateDoc(invitedAdminDoc.ref, { invitedBy: currentUser._id });
            }
        }

        // Eliminar la cuenta del usuario
        await deleteDoc(usersSnapshot.docs[0].ref);

        return NextResponse.json({ success: true, message: "User account deleted successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the user account", 500, error);
    }
}