import { Timestamp } from "firebase/firestore";

export type NotificationEntity = {
    _id: string,
    user_id: string,
    type: string,
    message: string,
    seen_at?: Timestamp,
    created_at: Timestamp,
};