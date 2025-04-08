import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { parseEntity } from "@/app/api/db/parse-entity";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { getDocs, query, where } from "firebase/firestore";
import { AdminEntity } from "../entity";

export async function validateIsAuthorizingAdmin(email: string, adminCode: string) {
    try {
        const adminQuery = query(
            FirebaseConfiguration.USER, 
            where("email", "==", email), 
            where("type", "==", "admin")
        );
        const admins = await getDocs(adminQuery);
    
        if (admins.empty) {
            throw new ApiResponseError(`There is not admin with the given email (${email})`, 400);
        }
        
        const adminSnapshot = admins.docs[0];
        const admin = adminSnapshot.data() as AdminEntity;
        if (admin.admin_code !== adminCode) {
            throw new ApiResponseError(`The code provided (${adminCode}) doesn't match the admin's`, 400);
        }

        return adminSnapshot;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't validate the authorizing admin", error, 500);
    }
}