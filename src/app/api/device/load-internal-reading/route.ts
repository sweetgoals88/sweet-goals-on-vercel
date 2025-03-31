import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { NextRequest } from "next/server";
import { makeErrorResponse } from "../../lib/make-error-response";
import { addDoc, arrayUnion, Timestamp, updateDoc } from "firebase/firestore";
import { authenticateDevice } from "../../lib/authenticate-device";

export async function POST(request: NextRequest) {
    return await authenticateDevice(request)
        .then(async (prototype) => {
            const { temperature, humidity, datetime: stringDatetime } = await request.json();
            // Validate the fields in the payload

            const datetime = Timestamp.fromDate(new Date(stringDatetime));
            const finalPayload = { temperature, humidity, datetime };

            const reading = await addDoc( FirebaseConfiguration.INTERNAL_READING, finalPayload);

            await updateDoc(prototype, {
                internal_readings: arrayUnion(reading.id)
            });
            return Response.json({ message: "Successful operation" });
        })
        .catch(error => makeErrorResponse("Couldn't load the internal reading", 500, error))
    ;
}
