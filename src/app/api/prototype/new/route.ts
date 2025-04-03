// Registers a new prototype under the account of the user who is logged in.
// Only for customers (not for admins)

import { NextRequest } from "next/server";
import { authenticateUser } from "../../lib/authenticate-user";
import { getUnactivePrototype } from "../../db/entities/user-entity";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { makeErrorResponse } from "../../lib/make-error-response";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        cookies();
        const {
            token,
            activation_code,
            panel_specifications,
            user_customization
        } = body;
    
        const user = await authenticateUser(token, { requiredType: "customer" });
    
        // do validation stuff

        const prototype = await getUnactivePrototype(activation_code);

        await updateDoc(prototype, {
            active: true,
            panel_specifications: { ...panel_specifications },
            user_customization: { ...user_customization },
        });
    
        await updateDoc(user, {
            prototypes: arrayUnion(prototype.id),
        });
        
        return Response.json({ message: "Operation successful" });
    } catch (error) {
        return makeErrorResponse("Couldn't register a new prototype", 500, error);
    }
}
