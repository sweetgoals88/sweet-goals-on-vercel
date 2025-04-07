import { _UserRegistrationInput } from "../_user/input";
import { AdminLabel } from "./entity";

export type AdminRegistrationInput = _UserRegistrationInput & {
    type: AdminLabel,
    adminEmail: string,
    adminCode: string,
};