import { AdminLabel, CustomerLabel, UserJwtPayload } from "../db/entities/user-entity";
import { verifyJwt } from "./jwt";
import { ApiResponseError } from "./api-response-error";
import { FirebaseConfiguration } from "../db/firebase-configuration";
import { doc } from "firebase/firestore";

export async function authenticateUser(token: string, options: { requiredType?: CustomerLabel | AdminLabel }) {
    let userPayload;
    try {
        userPayload = await verifyJwt<UserJwtPayload>(token);
    } catch (error) {
        throw ApiResponseError.aggregateWith("Invalid token", error, 401);
    }

    if (options.requiredType !== undefined) {
        if (userPayload.type !== options.requiredType) {
            throw new ApiResponseError(
                `The user is not of the type required (${userPayload.type} when ${options.requiredType} expected)`, 
                403
            );
        }
    }

    const user = doc(FirebaseConfiguration.USER, userPayload._id);
    return user;
}
