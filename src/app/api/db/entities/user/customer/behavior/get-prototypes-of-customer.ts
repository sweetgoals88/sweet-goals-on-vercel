import { doc, getDoc } from "firebase/firestore";
import { CustomerEntity } from "../entity";
import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { panelSpecificationsEntityToPreview, PrototypePreview } from "../../../prototype/preview";
import { PrototypeEntity } from "../../../prototype/entity";
import { reverseGeocoding } from "@/app/api/lib/geocoding";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { getExternalReadingsAfterLastReading } from "../../../prototype/behavior/get-external-readings-after-last-reading";
import { getInternalReadingsAfterLastReading } from "../../../prototype/behavior/get-internal-readings-after-last-reading";

export async function getPrototypesOfCustomer(customer: CustomerEntity, id: string) {
  try {
    const prototypeDocuments = await Promise.all(
      customer.prototypes.map((prototypeId) => {
        return getDoc(doc(FirebaseConfiguration.PROTOTYPE, prototypeId));
      })
    );
  
    const prototypes: PrototypePreview[] = (await Promise.all(
      prototypeDocuments.map(async (prototypeDocument) => {
        const prototype = prototypeDocument.data() as PrototypeEntity;
        if (!prototype) return null;
  
        const [ internalReadingsData, externalReadingsData, locationNameData ] = await Promise.all([
          getInternalReadingsAfterLastReading(prototype, null),
          getExternalReadingsAfterLastReading(prototype, null),
          reverseGeocoding(
            prototype.user_customization.latitude, 
            prototype.user_customization.longitude
          )
        ]);
  
        const [ internalReadings, lastInternalReading ] = internalReadingsData;
        const [ externalReadings, lastExternalReading ]= externalReadingsData;
        const locationName = locationNameData[0].formattedAddress as string;
  
        return {
          id: prototypeDocument.id,
          operational: prototype.operational,
          versionId: prototype.version_id,
          userCustomization: {
            ...prototype.user_customization,
            locationName
          },
          panelSpecifications: panelSpecificationsEntityToPreview(prototype.panel_specifications),
          internalReadings,
          externalReadings,
          lastInternalReading,
          lastExternalReading,
        };
      })
    )).filter(prototype => prototype !== null);
  
    return prototypes;
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the customer prototypes", error, 500);
  }
}
