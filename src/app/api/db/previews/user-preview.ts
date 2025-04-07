import { AdminLabel, AdminPermissions, CustomerLabel } from "../entities/user-entity";
import { getNotificationPreviewFromJson, NotificationPreview } from "./notification-preview";
import { getPrototypePreviewFromJson, PrototypePreview } from "./prototype-preview";

export type CustomerPreview = {
    id: string;
    name: string;
    surname: string;
    email: string;
    type: CustomerLabel;
    notifications: NotificationPreview[];
    oldestNotification: string | null;
    prototypes: PrototypePreview[];
};

export type AdminPreview = {
    id: string;
    name: string;
    surname: string;
    email: string;
    type: AdminLabel;
    adminCode: string;
    permissions: AdminPermissions;
    invitedAdmins: string[];
};

export type UserPreview = CustomerPreview | AdminPreview;

export function getCustomerPreviewFromJson(json: any): CustomerPreview {
    return {
        id: json.id,
        name: json.name,
        surname: json.surname,
        email: json.email,
        type: json.type,
        notifications: json.notifications.map(getNotificationPreviewFromJson),
        oldestNotification: json.oldestNotification,
        prototypes: json.prototypes.map(getPrototypePreviewFromJson)
    };
}