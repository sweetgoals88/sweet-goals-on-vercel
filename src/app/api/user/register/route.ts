import { NextRequest, NextResponse } from "next/server";
import { auth, db } from "@/app/api/db/firebase-configuration"; // Importa la configuración de Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
    try {
        const { nombre, email, password } = await request.json();

        // Validar que todos los campos estén completos
        if (!nombre || !email || !password) {
            return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 });
        }

        // Crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Guardar información adicional en Firestore
        const userRef = doc(db, "users", user.uid);  // 🔹 Usa db en lugar de app
        await setDoc(userRef, { nombre, email, uid: user.uid, tipoUsuario: "usuario" });

        return NextResponse.json({ message: "Usuario registrado con éxito" }, { status: 201 });
    
    } catch (error: any) {
        let mensajeError = "Error al registrar usuario";

        // Manejo de errores comunes de Firebase Auth
        if (error.code === "auth/email-already-in-use") {
            mensajeError = "El correo ya está registrado";
        } else if (error.code === "auth/weak-password") {
            mensajeError = "La contraseña debe tener al menos 6 caracteres";
        }

        return NextResponse.json({ error: mensajeError }, { status: 400 });
    }
}
