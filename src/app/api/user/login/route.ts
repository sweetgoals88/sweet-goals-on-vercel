import { NextRequest } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { signJwt } from "@/app/api/lib/jwt";
import { makeErrorResponse } from "../../lib/make-error-response";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        // 🔹 Buscar usuario en Firestore
        const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
        const users = await getDocsFromServer(userQuery);

        if (users.empty) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        const userData = users.docs[0].data();

        // 🔹 Validar contraseña (aquí falta la lógica para desencriptarla si está cifrada)
        if (userData.encrypted_password !== password) {
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        // 🔹 Generar JWT
        const token = signJwt({ uid: users.docs[0].id, email }, { expiresIn: "1h" });

        return new Response(JSON.stringify({ token }), { status: 200 });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
