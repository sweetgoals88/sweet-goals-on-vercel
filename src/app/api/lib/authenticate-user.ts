import { UserEntity, UserJwtPayload } from "../db/entities/user/entity";
import { verifyJwt } from "./jwt";
import { ApiResponseError } from "./api-response-error";
import { FirebaseConfiguration } from "../db/firebase-configuration";
import { doc, DocumentData, DocumentReference, DocumentSnapshot, getDoc } from "firebase/firestore";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { AdminLabel } from "../db/entities/user/admin/entity";
import { CustomerLabel } from "../db/entities/user/customer/entity";

/**
 * Checks that the user is logged in and also has a valid user type
 */
export async function authenticateUser(
    cookies: () => Promise<ReadonlyRequestCookies>, 
    options: { requiredType?: CustomerLabel | AdminLabel }
): Promise<DocumentSnapshot<DocumentData, DocumentData>> {
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

    const userData = userSnapshot.data() as UserEntity;

    if (userData.type !== "admin" && userData.type !== "customer") { 
        throw new ApiResponseError(`User type not recognized (${(userData as any).type})`, 400);
    }

    if (options.requiredType === undefined) {
        return userSnapshot;
    }

    if (options.requiredType !== userData.type) {
        throw new ApiResponseError(`User type not authorized (required ${options.requiredType} but ${userData.type} was found instead)`, 403);
    }

    return userSnapshot;
}
