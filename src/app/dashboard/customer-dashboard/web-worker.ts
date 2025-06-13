'use client';

import { ExternalReadingPreview } from "@/app/api/db/entities/external-reading/preview";
import { InternalReadingPreview } from "@/app/api/db/entities/internal-reading/preview";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { GetLastReadingsParams, GetLastReadingsResponse } from "@/app/api/prototype/get-last-internal-readings/route";
import apiCall from "@/utils/api-call";
import { error } from "console";
import { useEffect, useRef, useState } from "react";

export const INTERNAL_READINGS_REQUEST_INTERVAL = 3;
export const EXTERNAL_READINGS_REQUEST_INTERVAL = 15;

export function shouldMakeRequest(interval: number, currentDate: Date, dateOfLastRequest: Date | null): boolean {
    if (currentDate.getMinutes() % interval === 1 ) {
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

export function useWebWorker<K extends InternalReadingPreview | ExternalReadingPreview>(
    interval: number,
    lastReadings: GetLastReadingsParams,
    onSuccess: (readings: GetLastReadingsResponse<K>) => void,
    onError: (error: Error) => void = (error: Error) => {
        console.log("Something went wrong while fetching data");
        console.error(error);
    }
) {
    const workerRef = useRef<NodeJS.Timeout | null>(null);
    const [ dateOfLastRequest, setDateOfLastRequest ] = useState<Date>(new Date());

    useEffect(() => {
        console.log("The last readings are: ", lastReadings);

        workerRef.current = setInterval(async () => {
            const currentDate = new Date();
            if (shouldMakeRequest(interval, currentDate, dateOfLastRequest)) {
                console.log("Fetched data from the server", currentDate.toLocaleTimeString());
                setDateOfLastRequest(currentDate);
                await apiCall(
                    API_ENDPOINTS.PROTOTYPE.GET_LAST_INTERNAL_READINGS, 
                    lastReadings
                )
                    .then(response => response.json())
                    .then((data: GetLastReadingsResponse<K>) => onSuccess(data))
                    .catch(error => onError(error))
                ;
            } else {
                console.log("Didn't fetch data from the server", currentDate.toLocaleTimeString());
            }
        }, 30 * 1000);

        return () => {
            workerRef.current && clearInterval(workerRef.current);
        };
    }, [ lastReadings ]);
    return workerRef;
}
