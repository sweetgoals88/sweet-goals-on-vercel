import { encryptString } from "@/app/api/lib/encryption";
import { CustomerRegistrationInput } from "../input";
import { CustomerEntity } from "../entity";
import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { addDoc, updateDoc } from "firebase/firestore";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { validateIsNewPrototype } from "../../../prototype/behavior/validate-is-new-prototype";
import { validateIsNewUser } from "../../behavior/validate-is-new-user";
import { UserCustomizationIconTypes } from "../../../prototype/entity";

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

    const { longitude, latitude, label, icon } = input.user_customization;
    const { number_of_panels, peak_voltage, temperature_rate } = input.panel_specifications;

    await updateDoc(prototypeRef, {
      active: true,
      panel_specifications: { number_of_panels, peak_voltage, temperature_rate },
      user_customization: { longitude, latitude, label, icon },
    });
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Customer signup wasn't possible",
      error,
      500
    );
  }
}
