import { encryptString } from "@/app/api/lib/encryption";
import { validateIsNewPrototype, validateIsNewUser } from "../../entity";
import { CustomerRegistrationInput } from "../input";
import { CustomerEntity } from "../entity";
import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { addDoc, updateDoc } from "firebase/firestore";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function signupAsCustomer(input: CustomerRegistrationInput) {
  try {
    // validate customer and prototype stuff
    const prototypeRef = await validateIsNewPrototype(input.activation_code);
    await validateIsNewUser(input.email);

    const encryptedPassword = await encryptString(input.password);

    const customerPayload: CustomerEntity = {
      name: input.name,
      surname: input.surname,
      email: input.email,
      prototypes: [prototypeRef.id],
      type: "customer",
      encrypted_password: encryptedPassword,
    };

    await addDoc(FirebaseConfiguration.USER, customerPayload);
    await updateDoc(prototypeRef, {
      active: true,
      panel_specifications: { ...input.panel_specifications },
      user_customization: { ...input.user_customization },
    });
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Customer signup wasn't possible",
      error,
      500
    );
  }
}
