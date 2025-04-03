import { getPrototypeByKey } from "../db/entities/prototype-entity";
import { ApiResponseError } from "./api-response-error";

export async function authenticateDevice(request: Request) {
    try {
        const authorizationHeader = request.headers.get("Authorization");
    
        if (authorizationHeader === null) {
            throw new ApiResponseError("Authorization header is missing", 400);
        }
        const prototypeKey = authorizationHeader.split(" ")[1];

        let prototypeReference;

        try {
            prototypeReference = await getPrototypeByKey(prototypeKey);
        } catch (error) {
            throw ApiResponseError.aggregateWith("The provided key is invalid", error, 400);
        }

        return prototypeReference;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Device authentication failed", error, 500);
    }
}
