import { getPrototypeByKey } from "../db/prototype";
import { ApiResponseError } from "./api-response-error";
import { JwtApiPayload, verifyJwt } from "./jwt";


export async function authenticateDevice(request: Request) {
    try {
        const authorizationHeader = request.headers.get("Authorization");
    
        if (authorizationHeader === null) {
            throw new ApiResponseError("Authorization header is missing", 400);
        }
        const token = authorizationHeader.split(" ")[1];
        let payload;

        try { payload = await verifyJwt<JwtApiPayload>(token); }
        catch {
            throw new ApiResponseError("The given token is invalid", 404);
        }

        let prototypeReference;

        try {
            prototypeReference = await getPrototypeByKey(payload.prototype_key);
        } catch (error) {
            throw ApiResponseError.aggregateWith("The provided key is invalid", error, 400);
        }

        return prototypeReference;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Device authentication failed", error, 500);
    }
}
