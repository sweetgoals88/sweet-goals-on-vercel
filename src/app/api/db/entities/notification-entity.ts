import { Timestamp } from "firebase/firestore";

export type Notification = {
    _id: string,
    user_id: string,
    type: string,
    message: string,
    seen_at?: Timestamp,
    created_at: Timestamp,
};