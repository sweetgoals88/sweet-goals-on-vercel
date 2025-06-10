import { _UserRegistrationInput } from "../_user/input";
import { AdminLabel } from "./entity";

export type AdminRegistrationInputFragment = {
    type: AdminLabel,
    adminEmail: string,
    adminCode: string,
};

export type AdminRegistrationInput = _UserRegistrationInput & AdminRegistrationInputFragment;