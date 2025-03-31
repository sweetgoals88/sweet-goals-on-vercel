import { Timestamp } from "firebase/firestore";

export type ExternalReading = {
    _id?: string,
    datetime: Timestamp,
    light: number,
    temperature: number,
    current: number,
    voltage: number,
    wattage: number,
    panel_specifications: {
        number_of_panels: number,
        peak_voltage: number,
        temperature_rate: number
    }
};
