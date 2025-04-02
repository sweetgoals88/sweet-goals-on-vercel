import { Timestamp } from "firebase/firestore";
import { PanelSpecifications } from "./prototype-entity";

export type ExternalReadingEntity = {
    _id?: string,
    datetime: Timestamp,
    light: number,
    temperature: number,
    current: number,
    voltage: number,
    wattage: number,
    panel_specifications: PanelSpecifications
};
