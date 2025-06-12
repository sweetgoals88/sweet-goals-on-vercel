import { NextRequest } from "next/server";
import { validateIsNewPrototype } from "../../db/entities/prototype/behavior/validate-is-new-prototype";
import { ApiResponseError } from "../../lib/api-response-error";
import { makeErrorResponse } from "../../lib/make-error-response";
import makeOkResponse from "../../lib/ok-response";

export async function GET(request: NextRequest) {
    try {
        const activationCode = new URL(request.url).searchParams.get("activationCode");
        if (!activationCode || typeof activationCode !== "string") {
            throw new ApiResponseError("Missing activation code", 400);
        }
        await validateIsNewPrototype(activationCode);
        return makeOkResponse();
    } catch (error) {
        return makeErrorResponse("Couldn't validate the activation code provided", 400, error);
    }
}
