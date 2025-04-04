import { NextRequest } from "next/server";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { query, where, getDocsFromServer } from "firebase/firestore";
import { signJwt } from "@/app/api/lib/jwt";
import bcrypt from "bcryptjs"; 

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log("📩 Email recibido:", email);
        console.log("🔑 Password recibido:", password);

        if (!email || !password) {
            console.log("❌ Falta email o contraseña");
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }
        
        // 🔹 Buscar usuario en Firestore
        const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
        const users = await getDocsFromServer(userQuery);

        if (users.empty) {
            console.log("❌ Usuario no encontrado en Firebase");
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        const userData = users.docs[0].data();
        const userId = users.docs[0].id;

        console.log("✅ Usuario encontrado:", userData);

        // 🔹 Validar contraseña encriptada con bcrypt
        const isPasswordValid = await bcrypt.compare(password, userData.encrypted_password);
        console.log("🔍 Comparación de contraseña:", isPasswordValid);

        if (!isPasswordValid) {
            console.log("❌ Contraseña incorrecta");
            return new Response(JSON.stringify({ error: "Invalid email or password" }), { status: 401 });
        }

        // 🔹 Generar JWT con el rol
        const token = signJwt({ uid: userId, email, role: userData.role }, { expiresIn: "1h" });

        console.log("✅ Token generado correctamente");

        return new Response(JSON.stringify({ token, user: { role: userData.role } }), { status: 200 });

    } catch (error: any) {
        console.log("🔥 Error en la API:", error.message);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
