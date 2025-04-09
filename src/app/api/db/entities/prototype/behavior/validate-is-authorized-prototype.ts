import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { query, where, getDocs } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { parseEntity } from "../../../parse-entity";
import { PrototypeEntity } from "../entity";

/**
 * Gets a valid prototype from the database. In other words, 
 * it gets the prototye with the key passed as long as it is
 * active.
 * @param prototypeKey The key of the device to find
 * @returns The device whose API key matches the one passed
 */
export async function validateIsAuthorizedPrototype(prototypeKey: string) {
    const results = query(FirebaseConfiguration.PROTOTYPE, where("key", "==", prototypeKey));
    const resultsArray = await getDocs(results);
  
    if (resultsArray.size > 1) {
      throw new ApiResponseError("There was an internal database configuration error", 500);
    }

    if (resultsArray.empty) {
      throw new ApiResponseError("The requested key doesn't exist", 404);
    }

    const prototype = parseEntity<PrototypeEntity>(resultsArray.docs[0]);

    if (!prototype.active) {
      throw new ApiResponseError("The prototype whose key was passed is not active anymore", 404);
    }

    return resultsArray.docs[0].ref;
}
