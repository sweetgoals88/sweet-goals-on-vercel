import { NextRequest } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { authenticateDevice } from "../../lib/authenticate-device";
import { updateDoc } from "firebase/firestore";
import { ApiResponseError } from "../../lib/api-response-error";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { status } = body;
        if (status === undefined) {
            throw new ApiResponseError("Missing status in request body", 400);
        }

        let booleanStatus = false;
        if (status === "operational") {
            booleanStatus = true;
        } else if (status === "non-operational") {
            booleanStatus = false;
        } else {
            throw new ApiResponseError(`Invalid status value (${status})`, 400);
        }

        const device = await authenticateDevice(request);

        updateDoc(device, {
            operational: booleanStatus
        });

        return Response.json({ message: "Successful operation" });
    } catch (error) {
        return makeErrorResponse("Couldn't report operational status", 500, error);
    }
}
