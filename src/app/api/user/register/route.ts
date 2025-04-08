import { NextRequest, NextResponse } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { UserRegistrationInput } from "../../db/entities/user/entity";
import { signupAsCustomer } from "../../db/entities/user/customer/behavior/signup-as-customer";
import { signupAsAdmin } from "../../db/entities/user/admin/behavior/signup-as-admin";
import { ApiResponseError } from "../../lib/api-response-error";

export async function POST(request: NextRequest) {
    try {
        const input: UserRegistrationInput = JSON.parse(await request.text());

        if (!input.type) {
            throw new ApiResponseError(`El tipo de usuario no fue dado`, 400);
        }

        if (input.type !== "customer" && input.type !== "admin") {
            throw new ApiResponseError(`Tipo de usuario inválido (${input["type"]})`, 400);
        }

        if (input.type === "customer") {
            await signupAsCustomer(input);
        } else {
            await signupAsAdmin(input);
        }
        
        return NextResponse.json({ message: "Successful operation" }, { status: 201 });
    } catch (error) {
        console.log(error);
        return makeErrorResponse("Couldn't sign the user up", 500, error);
    }
}
