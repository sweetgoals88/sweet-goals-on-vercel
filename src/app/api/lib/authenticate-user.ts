import { AdminLabel, CustomerLabel, UserJwtPayload } from "../db/entities/user-entity";
import { verifyJwt } from "./jwt";
import { ApiResponseError } from "./api-response-error";
import { FirebaseConfiguration } from "../db/firebase-configuration";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest } from "next/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function authenticateUser(cookies: () => Promise<ReadonlyRequestCookies>, options: { requiredType?: CustomerLabel | AdminLabel }) {
    const token = (await cookies()).get("token");
    if (token === undefined) {
        throw new ApiResponseError("The token is not present", 401);
    }

    const jwtPayload = await verifyJwt<UserJwtPayload>(token.value);
    const _id = jwtPayload._id;

    const customerReference = doc(FirebaseConfiguration.USER, _id);
    const customerSnapshot = await getDoc(customerReference);

    if (!customerSnapshot.exists) { 
        throw new ApiResponseError("User not found", 404);
    }

    return customerReference;
}
