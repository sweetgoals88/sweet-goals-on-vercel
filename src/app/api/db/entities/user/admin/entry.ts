import { AdminPermissions } from "./entity";

export type AdminEntry = {
    id: string,
    name: string,
    surname: string,
    email: string,
    adminCode: string,
    permissions: AdminPermissions,
};
