import { PanelSpecificationsEntity } from "../../prototype/entity";
import { _UserRegistrationInput } from "../_user/input";
import { CustomerLabel } from "./entity";

export type CustomerRegistrationInputFragment = {
    type: CustomerLabel,
    activation_code: string,
    user_customization: {
        latitude: number,
        longitude: number, 
        label: string, 
        icon: string,
    },
    panel_specifications: PanelSpecificationsEntity
};

export type CustomerRegistrationInput = _UserRegistrationInput & CustomerRegistrationInputFragment;
