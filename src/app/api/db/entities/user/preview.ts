import { getNotificationPreviewFromJson } from "../notification/preview";
import { getPrototypePreviewFromJson } from "../prototype/preview";
import { AdminPreview } from "./admin/preview";
import { CustomerPreview } from "./customer/preview";

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