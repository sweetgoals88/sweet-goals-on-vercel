import { NextRequest, NextResponse } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { signJwt } from "@/app/api/lib/jwt";
import { makeErrorResponse } from "../../lib/make-error-response";
import { validateString } from "../../lib/encryption";
import { parseEntity } from "../../db/parse-entity";
import { UserEntity, UserJwtPayload } from "../../db/entities/user-entity";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        let body;
        try {
            body = JSON.parse(await request.text());
        } catch (e) {
            console.log(e);
            throw e;
        }
      
        const { email, password } = body;
        if (!email || !password) {
            return makeErrorResponse("Email and password are required", 400);
        }
        const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
        const users = await getDocsFromServer(userQuery);

        if (users.empty) {
            return makeErrorResponse("Invalid email or password", 401);
        }
        
        const userData = parseEntity<UserEntity>(users.docs[0]);
        
        if (!(await validateString(password, userData.encrypted_password))) {
            return makeErrorResponse("Invalid email or password", 401);
        }

        const token = await signJwt<UserJwtPayload>(
            { 
                _id: userData._id as string, 
                type: userData.type,
                encrypted_password: userData.encrypted_password,
            }, 
            { expiresIn: "1d" }
        );

        (await cookies()).set("token", token, {
            httpOnly: true,                                 // Prevents JavaScript access (security)
            secure: process.env.NODE_ENV === "production",  // Only HTTPS
            path: "/",                                      // Cross-site availability
            sameSite: "lax",                                // CSRF protection 
        });
        const response = NextResponse.json({ success: true });

        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error: any) {
        return makeErrorResponse("Couldn't log the user in", 500, error);
    }
}
