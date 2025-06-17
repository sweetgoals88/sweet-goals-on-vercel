import { ExternalReadingPreview } from "@/app/api/db/entities/external-reading/preview";
import { InternalReadingPreview } from "@/app/api/db/entities/internal-reading/preview";
import { PanelSpecificationsPreview, PrototypePreview } from "@/app/api/db/entities/prototype/preview";
import { CustomerPreview } from "@/app/api/db/entities/user/customer/preview";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { useDummyWebWorker } from "./dummy-web-worker";
import { INTERNAL_READINGS_REQUEST_INTERVAL, EXTERNAL_READINGS_REQUEST_INTERVAL, MAX_READINGS_PER_CHART } from "./control-variables";
import { GetLastReadingsResponse } from "@/app/api/prototype/shared/get-last-readings-types";
import { ItemType } from "@/app/api/lib/item-type";

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
        (json: any) => {
            return json.map((item: any) => ({
                newLastReading: item.newLastReading,
                prototypeId: item.prototypeId,
                readings: item.readings.map((reading: any) => ({
                    id: reading.id as string,
                    dateTime: new Date(Date.parse(reading.dateTime)),
                    humidity: parseFloat(reading.humidity),
                    temperature: parseFloat(reading.temperature),
                }) as InternalReadingPreview),
            } as ItemType<GetLastReadingsResponse<InternalReadingPreview>>));
        },
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
        (json: any) => {
            return json.map((item: any) => ({
                newLastReading: item.newLastReading,
                prototypeId: item.prototypeId,
                readings: item.readings.map((reading: any) => ({
                    current: parseFloat(reading.current),
                    dateTime: new Date(Date.parse(reading.dateTime)),
                    id: reading.id as string,
                    light: parseFloat(reading.light),
                    panelSpecifications: {
                        numberOfPanels: parseFloat(reading.panelSpecifications.numberOfPanels),
                        peakVoltage: parseFloat(reading.panelSpecifications.peakVoltage),
                        temperatureRate: parseFloat(reading.panelSpecifications.temperatureRate),
                    } as PanelSpecificationsPreview,
                    temperature: parseFloat(reading.temperature),
                    voltage: parseFloat(reading.voltage),
                    wattage: parseFloat(reading.wattage),
                } as ExternalReadingPreview)),
            }) as ItemType<GetLastReadingsResponse<ExternalReadingPreview>>);
        },
        (prototype: PrototypePreview, readingObject: GetLastReadingsResponse<ExternalReadingPreview>[number]) => {
            let newReadings = [ ...prototype.externalReadings, ...readingObject.readings ];
            newReadings = newReadings.slice(Math.max(newReadings.length - MAX_READINGS_PER_CHART, 0));

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