import { encryptString } from "@/app/api/lib/encryption";
import { validateIsNewUser } from "../../entity";
import { AdminRegistrationInput } from "../input";
import { AdminEntity } from "../entity";
import { addDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import crypto from "crypto";
import { validateIsAuthorizingAdmin } from "./validate-is-authorizing-admin";

export async function signupAsAdmin(input: AdminRegistrationInput) {
  try {
    // validate admin stuff
    const authorizingAdmin = await validateIsAuthorizingAdmin(
      input.adminEmail,
      input.adminCode
    );
    await validateIsNewUser(input.email);

    const encryptedPassword = await encryptString(input.password);

    const adminPayload: AdminEntity = {
      admin_code: crypto.randomBytes(8).toString("hex"),
      email: input.email,
      encrypted_password: encryptedPassword,
      name: input.name,
      surname: input.surname,
      invited_admins: [],
      permissions: "read",
      type: "admin",
    };

    const admin = await addDoc(FirebaseConfiguration.USER, adminPayload);
    await updateDoc(authorizingAdmin, {
      invited_admins: arrayUnion(admin.id),
    });
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Admin signup wasn't possible",
      error,
      500
    );
  }
}
