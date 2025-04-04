import { NextRequest, NextResponse } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { UserRegistrationInput, signupAdmin, signupCustomer } from "../../db/entities/user-entity";

export async function POST(request: NextRequest) {
    try {
        console.log("Customer signup is being called");

        // Obtiene y valida la estructura de los datos recibidos
        const input = await request.json() as UserRegistrationInput;

        // Verifica que el tipo de usuario sea válido
        if (!input.type || (input.type !== "customer" && input.type !== "admin")) {
            return NextResponse.json({ error: "Tipo de usuario inválido" }, { status: 400 });
        }

        // Registra al usuario dependiendo de su tipo
        if (input.type === "customer") {
            await signupCustomer(input);
        } else {
            await signupAdmin(input);
        }
        
        return NextResponse.json({ message: "Successful operation" }, { status: 201 });

    } catch (error) {
        return makeErrorResponse("Couldn't sign the user up", 500, error);
    }
}
