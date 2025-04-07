import { getDocs, query, where } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { parseEntity } from "../../../parse-entity";
import { PrototypeEntity } from "../entity";

export async function validateIsNewPrototype(activationCode: string) {
    try {
        const prototypeQuery = query(FirebaseConfiguration.PROTOTYPE, where("activation_code", "==", activationCode));
        const prototypes = await getDocs(prototypeQuery);
        if (prototypes.empty) {
            throw new ApiResponseError(`The activation code provided doesn't exist (${activationCode})`, 400);
        }
        
        if (prototypes.size > 1) {
            throw new ApiResponseError(`Activation codes are duplicated in the database`, 500);
        }
    
        const device = parseEntity<PrototypeEntity>(prototypes.docs[0]);
        if (device.active) {
            throw new ApiResponseError(`The activation code provided has already been used (${activationCode})`, 400);
        }
    
        return prototypes.docs[0].ref;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't get the unactive prototype requested", error, 500);
    }
}