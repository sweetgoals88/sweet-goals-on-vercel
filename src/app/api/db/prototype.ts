import { getDocs, query, where } from "firebase/firestore";
import { FirebaseConfiguration } from "./firebase-configuration";
import { parseEntity } from "./parse-entity";
import { ApiResponseError } from "../lib/api-response-error";

export type PrototypeEntity = {
    _id: string,
    active: boolean,
    external_readings: string[],
    internal_readings: string[],
    key: string,
    version_id: string
};

export async function getPrototypeByKey(prototypeKey: string) {
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
