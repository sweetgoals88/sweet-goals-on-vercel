import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { NextRequest } from "next/server";
import { makeErrorResponse } from "../lib/make-error-response";
import { addDoc, arrayUnion, Timestamp, updateDoc } from "firebase/firestore";
import { authenticateDevice } from "../lib/authenticate-device";

export async function POST(request: NextRequest) {
    return await authenticateDevice(request)
        .then(async (prototype) => {
            const payload = await request.json();
            const datetime = new Date(payload.datetime);
            const finalPayload = { ...payload, datetime: Timestamp.fromDate(datetime) };

            // validate the final payload

            const reading = await addDoc( FirebaseConfiguration.EXTERNAL_READING, finalPayload );

            await updateDoc(prototype, {
                external_readings: arrayUnion(reading.id)
            });
            return Response.json({ message: "Successful operation" });
        })
        .catch(error => makeErrorResponse("Couldn't load the external reading", 500, error))
    ;
}
