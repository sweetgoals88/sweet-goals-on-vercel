import { getDocsFromServer, query, where, GeoPoint } from "firebase/firestore";
import { FirebaseConfiguration } from "../firebase-configuration";
import { parseEntity } from "../parse-entity";
import { ApiResponseError } from "../../lib/api-response-error";

export type PanelSpecifications = {
  number_of_panels: number,
  peak_voltage: number,
  temperature_rate: number
};

export type PrototypeEntity = {
    _id?: string,
    key: string,
    active: boolean,
    operational: boolean,
    activation_code: string,
    external_readings: string[],
    internal_readings: string[],
    version_id: string,
    user_customization: {
      latitude: number,
      longitude: number,
      label: string,
      icon: string,
    },
    panel_specifications: PanelSpecifications
};

/**
 * Gets a valid prototype from the database. In other words, 
 * it gets the prototye with the key passed as long as it is
 * active.
 * @param prototypeKey The key of the device to find
 * @returns The device whose API key matches the one passed
 */
export async function getPrototypeByKey(prototypeKey: string) {
    const results = query(FirebaseConfiguration.PROTOTYPE, where("key", "==", prototypeKey));
    const resultsArray = await getDocsFromServer(results);
  
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
