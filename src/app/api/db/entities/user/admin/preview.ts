import { NotificationPreview } from "../../notification/preview";
import { PrototypeEntry } from "../../prototype/entry";
import { CustomerEntry } from "../customer/entry";
import { AdminLabel, AdminPermissions } from "./entity";
import { AdminEntry } from "./entry";

export type AdminPreview = {
    id: string;
    name: string;
    surname: string;
    email: string;
    type: AdminLabel;
    adminCode: string;
    permissions: AdminPermissions;
    admins: AdminEntry[];
    customers: CustomerEntry[];
    lastCustomer: string | null;
    prototypes: PrototypeEntry[];
    lastPrototype: string | null;
    notifications: NotificationPreview[];
    lastNotification: string | null;
};
