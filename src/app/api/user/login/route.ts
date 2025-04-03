import { NextRequest } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { signJwt } from "@/app/api/lib/jwt";
import { makeErrorResponse } from "../../lib/make-error-response";
import { validateString } from "../../lib/encryption";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return makeErrorResponse("Email and password are required", 400);
        }

        const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
        const users = await getDocsFromServer(userQuery);

        if (users.empty) {
            return makeErrorResponse("Invalid email or password", 401);
        }
        
        const userData = users.docs[0].data();
        
        if (!(await validateString(password, userData.encrypted_password))) {
            return makeErrorResponse("Invalid email or password", 401);
        }

        const token = signJwt({ _id: users.docs[0].id, email }, { expiresIn: "1d" });

        return Response.json({ token }, { status: 200 });

    } catch (error: any) {
        return makeErrorResponse("Couldn't log the user in", 500, error);
    }
}
