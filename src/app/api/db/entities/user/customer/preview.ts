import { NotificationPreview } from "../../notification/preview";
import { PrototypePreview } from "../../prototype/preview";
import { CustomerLabel } from "./entity";

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