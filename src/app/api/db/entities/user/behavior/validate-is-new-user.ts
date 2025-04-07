import { getDocs, query, where } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function validateIsNewUser(email: string) {
    const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
    const users = await getDocs(userQuery);
    if (!users.empty) {
        throw new ApiResponseError(`The email provided has already been used ${email}`, 400);
    }    
}