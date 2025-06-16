'use client';

import { ExternalReadingPreview } from "@/app/api/db/entities/external-reading/preview";
import { InternalReadingPreview } from "@/app/api/db/entities/internal-reading/preview";
import { PrototypePreview } from "@/app/api/db/entities/prototype/preview";
import { CustomerPreview } from "@/app/api/db/entities/user/customer/preview";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { GetLastReadingsParams, GetLastReadingsResponse } from "@/app/api/prototype/get-last-internal-readings/route";
import apiCall from "@/utils/api-call";
import { useEffect, useRef, useState } from "react";
import { ItemType } from "@/app/api/lib/item-type";

export function shouldMakeRequest(interval: number, currentDate: Date, dateOfLastRequest: Date | null): boolean {
    if (currentDate.getMinutes() % interval === 1) {
        if (dateOfLastRequest !== null) {
            const timeDifference = currentDate.getTime() - dateOfLastRequest.getTime();
            const minutesDifference = Math.floor(timeDifference / (1000 * 60));
            return minutesDifference >= interval;
        } else {
            return true;
        }
    }
    return false;
}

/**
 * 
 * @param interval Number of minutes to wait before requesting new readings.
 * @param apiEndpoint The API endpoint to call for fetching readings.
 * @param prototypes The list of prototoypes for which to fetch readings.
 * @param transformProtoype Function that transforms a prototype into the format required by the API.
 * @param mergeReadings Function that merges new readings into its corresponding prototype object.
 * @param setUserData Function that updates the user data once new readings are received.
 * @param onError Function to call in case fetching data goes wrong.
 * @returns 
 */
export function useDummyWebWorker<K extends InternalReadingPreview | ExternalReadingPreview>(
    interval: number,
    apiEndpoint: string,
    prototypes: PrototypePreview[],
    transformProtoype: (prototype: PrototypePreview) => ItemType<GetLastReadingsParams>,
    mergeReadings: (prototype: PrototypePreview, readingObject: GetLastReadingsResponse<K>[number]) => PrototypePreview,
    setUserData: (callback: (data: CustomerPreview) => CustomerPreview) => void,
    onError: (error: Error) => void = (error: Error) => {
        console.log("Something went wrong while fetching data");
        console.error(error);
    }
) {
    const workerRef = useRef<NodeJS.Timeout | null>(null);
    const [dateOfLastRequest, setDateOfLastRequest] = useState<Date>(new Date());
    
    const lastReadings: GetLastReadingsParams = prototypes.map(transformProtoype);

    useEffect(() => {
        workerRef.current = setInterval(async () => {
            const currentDate = new Date();
            if (shouldMakeRequest(interval, currentDate, dateOfLastRequest)) {
                setDateOfLastRequest(currentDate);
                await apiCall(apiEndpoint, lastReadings)
                    .then(response => response.json())
                    .then((data: GetLastReadingsResponse<K>) => {
                        const updatedPrototypes = prototypes.map((prototype) => {
                            const readingObject = data.find(item => item.prototypeId === prototype.id);
                            if (readingObject) {
                                return mergeReadings(prototype, readingObject);
                            }
                            return prototype;
                        });
                        setUserData((previousData: CustomerPreview) => ({
                            ...previousData,
                            prototypes: updatedPrototypes,
                        }));
                    })
                    .catch(error => onError(error));
            }
        }, 30 * 1000);

        return () => {
            workerRef.current && clearInterval(workerRef.current);
        };
    }, [lastReadings]);

    return workerRef;
}
