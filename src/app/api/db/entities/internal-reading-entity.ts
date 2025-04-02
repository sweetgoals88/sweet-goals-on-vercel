import { Timestamp } from "firebase/firestore";

export type InternalReadingEntity = {
    _id?: string,
    datetime: Timestamp,
    humidity: number,
    temperature: number
};
