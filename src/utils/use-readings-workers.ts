import { ExternalReadingPreview } from "@/app/api/db/entities/external-reading/preview";
import { InternalReadingPreview } from "@/app/api/db/entities/internal-reading/preview";
import { PrototypePreview } from "@/app/api/db/entities/prototype/preview";
import { CustomerPreview } from "@/app/api/db/entities/user/customer/preview";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { GetLastReadingsResponse } from "@/app/api/prototype/get-last-internal-readings/route";
import { useDummyWebWorker } from "./dummy-web-worker";
import { INTERNAL_READINGS_REQUEST_INTERVAL, EXTERNAL_READINGS_REQUEST_INTERVAL, MAX_READINGS_PER_CHART } from "./control-variables";

/**
 * 
 * @param prototypes The prototypes for which to fetch readings.
 * @param setUserData Function that updates the user data once new readings are received.
 * @param onError Function to call in case data fetching fails.
 * @returns A pair of dummy web workers that fetches data in `INTERNAL_READINGS_REQUEST_INTERVAL` and `EXTERNAL_READINGS_REQUEST_INTERVAL` minutes respectively.
 */
export function useReadingsWorkers(
    prototypes: PrototypePreview[], 
    setUserData: (callback: (data: CustomerPreview) => CustomerPreview) => void,
    onError: (error: Error) => void
) {
    const internalReadingsWorker = useDummyWebWorker<InternalReadingPreview>(
        INTERNAL_READINGS_REQUEST_INTERVAL,
        API_ENDPOINTS.PROTOTYPE.GET_LAST_INTERNAL_READINGS,
        prototypes,
        (prototype) => ({
          prototypeId: prototype.id,
          lastReadingId: prototype.lastInternalReading,
        }),
        (prototype: PrototypePreview, readingObject: GetLastReadingsResponse<InternalReadingPreview>[number]) => {
            let newReadings = [ ...prototype.internalReadings, ...readingObject.readings ];
            newReadings = newReadings.slice(newReadings.length - MAX_READINGS_PER_CHART);

            return {
                ...prototype,
                internalReadings: newReadings,
                lastInternalReading: readingObject.newLastReading
            };
        },
        setUserData,
        onError
    );

    const externalReadingsWorker = useDummyWebWorker<ExternalReadingPreview>(
        EXTERNAL_READINGS_REQUEST_INTERVAL,
        API_ENDPOINTS.PROTOTYPE.GET_LAST_EXTERNAL_READINGS,
        prototypes,
        (prototype) => ({
          prototypeId: prototype.id,
          lastReadingId: prototype.lastExternalReading,
        }),
        (prototype: PrototypePreview, readingObject: GetLastReadingsResponse<ExternalReadingPreview>[number]) => {
            let newReadings = [ ...prototype.externalReadings, ...readingObject.readings ];
            newReadings = newReadings.slice(newReadings.length - MAX_READINGS_PER_CHART);

            return {
                ...prototype,
                externalReadings: newReadings,
                lastExternalReading: readingObject.newLastReading
            };
        },
        setUserData,
        onError
    );

    return [ internalReadingsWorker, externalReadingsWorker ];
}