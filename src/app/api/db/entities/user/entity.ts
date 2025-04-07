import { AdminEntity } from "./admin/entity";
import { CustomerEntity } from "./customer/entity";
import { AdminRegistrationInput } from "./admin/input";
import { CustomerRegistrationInput } from "./customer/input";

export type UserRegistrationInput = AdminRegistrationInput | CustomerRegistrationInput;
export type UserEntity = CustomerEntity | AdminEntity;

export type UserJwtPayload = {
    _id: string,
    type: string,
    encrypted_password: string,
}
