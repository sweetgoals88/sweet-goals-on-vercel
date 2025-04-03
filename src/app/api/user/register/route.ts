import { NextRequest } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { UserRegistrationInput, _UserRegistrationInput, signupAdmin, signupCustomer } from "../../db/entities/user-entity";

export async function POST(request: NextRequest) {
    try {
        console.log("Customer signup is being called");
        const input = await request.json() as UserRegistrationInput;
        // validate email, password, etc.

        if (input.type === "customer") {
            await signupCustomer(input);
        } else {
            await signupAdmin(input);
        }
        
        return Response.json({ message: "Successful operation" });
    } catch (error) {
        return makeErrorResponse("Couldn't sign the user up", 500, error);
    }
}
