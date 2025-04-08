import { getDocs, query, where } from "firebase/firestore";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function validateIsNewUser(userEmail: string) {
  try {
    const userQuery = query(
      FirebaseConfiguration.USER,
      where("email", "==", userEmail)
    );
    const users = await getDocs(userQuery);
    if (!users.empty) {
      throw new ApiResponseError(
        `The email provided has already been used ${userEmail}`,
        400
      );
    }
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Couldn't validate the email provided",
      error,
      500
    );
  }
}
