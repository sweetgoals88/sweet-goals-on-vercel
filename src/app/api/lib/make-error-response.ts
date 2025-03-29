import { ApiResponseError } from "./api-response-error";

export function makeErrorResponse(message: string, status: number, error?: Error) {
    if (error === undefined) {
        return Response.json(
            { message }, 
            { status }
        );
    }

    if (error instanceof ApiResponseError) {
        return Response.json(
            { message, error: error.message }, 
            { status: error.status }
        );
    }

    return Response.json(
        { message, error: error.message },
        { status }
    );
}
