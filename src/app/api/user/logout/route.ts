// Deletes the user token from the cookies of the request

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { makeErrorResponse } from "../../lib/make-error-response";
import makeOkResponse from "../../lib/ok-response";

export async function POST() {
    try {
        // Eliminar el token de las cookies
        (await cookies()).set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            expires: new Date(0),
        });

        const response = makeOkResponse({ success: true, message: "User logged out successfully" });

        // Configurar encabezados CORS
        response.headers.set("Access-Control-Allow-Credentials", "true");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return response;
    } catch (error: any) {
        return makeErrorResponse("Couldn't log the user out", 500, error);
    }
}