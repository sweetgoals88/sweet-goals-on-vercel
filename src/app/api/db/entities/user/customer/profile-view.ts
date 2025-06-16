import { _UserProfileView } from "../_user/profile-view";
import { CustomerLabel } from "./entity";

export type CustomerProfileView = _UserProfileView & {
    type: CustomerLabel;
    // I don't really think the user should need any other
    // data apart from the basic one in _UserProfileView,
    // but I'm going to leave this type open for the future
};