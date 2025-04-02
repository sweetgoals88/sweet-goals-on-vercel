import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { NextRequest } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { addDoc, arrayUnion, DocumentData, getDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import { authenticateDevice } from "../../lib/authenticate-device";
import { ExternalReadingEntity } from "../../db/entities/external-reading-entity";

export async function POST(request: NextRequest) {
    return await authenticateDevice(request)
        .then(async (prototype) => {
            const { datetime: stringDatetime, light, temperature, current } = await request.json();

            // Should validate the light, temperature and current values

            const datetime = Timestamp.fromDate(new Date(stringDatetime));
            const prototypeData = (await getDoc(prototype)).data() as DocumentData;
            
            const { number_of_panels, peak_voltage, temperature_rate } = prototypeData.device_specifications;
            const voltage = peak_voltage * (light / 120) / 1000 - temperature * temperature_rate;

            const finalPayload: ExternalReadingEntity = {
                datetime,
                light,
                temperature,
                current,
                voltage,
                wattage: voltage * current,
                panel_specifications: {
                    number_of_panels,
                    peak_voltage,
                    temperature_rate
                }
            };

            const reading = await addDoc(FirebaseConfiguration.EXTERNAL_READING, finalPayload );

            await updateDoc(prototype, {
                external_readings: arrayUnion(reading.id)
            });
            return Response.json({ message: "Successful operation" });
        })
        .catch(error => makeErrorResponse("Couldn't load the external reading", 500, error))
    ;
}
