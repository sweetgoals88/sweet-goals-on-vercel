import { AdminLabel, CustomerLabel, UserEntity, UserJwtPayload } from "../db/entities/user-entity";
import { verifyJwt } from "./jwt";
import { ApiResponseError } from "./api-response-error";
import { FirebaseConfiguration } from "../db/firebase-configuration";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function authenticateUser(cookies: () => Promise<ReadonlyRequestCookies>, options: { requiredType?: CustomerLabel | AdminLabel }): Promise<DocumentSnapshot<DocumentData, DocumentData>> {
    const token = (await cookies()).get("token");
    if (token === undefined) {
        throw new ApiResponseError("The token is not present", 401);
    }

    const jwtPayload = await verifyJwt<UserJwtPayload>(token.value);
    const _id = jwtPayload._id;

    const userReference = doc(FirebaseConfiguration.USER, _id);
    const userSnapshot = await getDoc(userReference);

    if (!userSnapshot.exists) { 
        throw new ApiResponseError("User not found", 404);
    }

    if (options.requiredType === undefined) {
        return userSnapshot;
    }

    const userData = userSnapshot.data() as UserEntity;

    if (options.requiredType !== userData.type) {
        throw new ApiResponseError(`User type not authorized (required ${options.requiredType} but ${userData.type} was found instead)`, 403);
    }

    return userSnapshot;
}
