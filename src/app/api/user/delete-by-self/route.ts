import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, deleteDoc, updateDoc, documentId, getDocs } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { verifyJwt } from "@/app/api/lib/jwt";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { UserEntity } from "../../db/entities/user/entity";

// Deletes the account of the user themselves (i. e., the use who wants to 
// delete their account must be the one to call this endpoint)

export async function POST(request: NextRequest) {
    try {
        const userSnapshot = await authenticateUser(() => cookies(), {});
        const user = userSnapshot.data() as UserEntity;

        if (user.type === "customer") {
            // Don't need to handle this case; it is assumed a user will always have at least one prototype
            // if (user.prototypes.length == 0)

            const prototypesQuery = query(FirebaseConfiguration.PROTOTYPE, where(documentId(), "in", user.prototypes));
            const prototypesSnapshot = await getDocs(prototypesQuery);

            for (const prototypeDoc of prototypesSnapshot.docs) {
                await updateDoc(
                    prototypeDoc.ref, { 
                        active: false, 
                        operational: false, 
                        internal_readings: [], 
                        external_readings: [] 
                    }
                );
            }
        }

        if (user.type === "admin") {
            // should check this one later
        }

        await deleteDoc(userSnapshot.ref);

        return NextResponse.json({ success: true, message: "User account deleted successfully" });
    } catch (error: any) {
        return makeErrorResponse("Couldn't delete the user account", 500, error);
    }
}