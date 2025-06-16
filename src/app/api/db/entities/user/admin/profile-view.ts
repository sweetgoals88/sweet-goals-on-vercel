import { _UserProfileView } from "../_user/profile-view";
import { AdminLabel, AdminPermissions } from "./entity";

export type AdminProfileView = _UserProfileView & {
    type: AdminLabel;
    admin_code: string;
    permissions: AdminPermissions;
};
