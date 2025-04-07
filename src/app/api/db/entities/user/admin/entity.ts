import { _UserEntity } from "../_user/entity";

export type AdminLabel = "admin";

export type AdminPermissions = "read" | "all";

export type AdminEntity = _UserEntity & {
    type: AdminLabel,
    admin_code: string,
    permissions: AdminPermissions,
    invited_admins: string[],
};
