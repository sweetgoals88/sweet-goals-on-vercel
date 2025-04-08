import { NextRequest } from "next/server";
import { updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { authenticateUser } from "../../lib/authenticate-user";
import { cookies } from "next/headers";
import { _UserUpdateInput } from "../../db/entities/user/_user/input";
import { validateIsNewUser } from "../../db/entities/user/behavior/validate-is-new-user";
import { encryptString, validateString } from "../../lib/encryption";
import { UserEntity } from "../../db/entities/user/entity";
import { ApiResponseError } from "../../lib/api-response-error";
import { _UserEntity } from "../../db/entities/user/_user/entity";

// Updates the user profile with the new data given
export async function POST(request: NextRequest) {
    try {
        const user = await authenticateUser(() => cookies(), {});
        const payload = JSON.parse(await request.text()) as _UserUpdateInput;

        // do validation of the payload

        const { name, surname } = payload;
        const updateEntries: { [K in keyof _UserEntity]?: _UserEntity[K] }[] = [
            { name }, { surname }
        ];

        if (payload.email.length !== 0) {
            await validateIsNewUser(payload.email);
            updateEntries.push({ email: payload.email });
        }

        if (payload.newPassword.length !== 0 && payload.oldPassword.length !== 0) {
            const userData = user.data() as UserEntity;
            const isSamePassword = await validateString(payload.oldPassword, userData.encrypted_password);
            if (!isSamePassword) {
                throw new ApiResponseError("The given password doesn't match the previous password set", 400);
            }
    
            const newPassword = await encryptString(payload.newPassword);
            updateEntries.push({ encrypted_password: newPassword });
        }

        const updateObject = Object.fromEntries(
            updateEntries.flatMap(entry => Object.entries(entry))
        );
        console.log("This is the update object", updateObject);
        await updateDoc(user.ref, updateObject);
        
        return Response.json({ message: "Successful operation" }, { status: 200 })
    } catch (error: any) {
        console.log(error);
        return makeErrorResponse("Couldn't update the user profile", 500, error);
    }
}