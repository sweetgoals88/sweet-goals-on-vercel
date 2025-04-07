import { getPanelSpecificationsPreviewFromJson, PanelSpecificationsPreview } from "../prototype/preview";

export type ExternalReadingPreview = {
    id: string,
    dateTime: Date,
    light: number,
    temperature: number,
    current: number,
    voltage: number,
    wattage: number,
    panelSpecifications: PanelSpecificationsPreview,
};

export function getExternalReadingPreviewFromJson(json: any): ExternalReadingPreview {
    return {
        id: json.id,
        dateTime: new Date(json.dateTime),
        light: json.light,
        temperature: json.temperature,
        current: json.current,
        voltage: json.voltage,
        wattage: json.wattage,
        panelSpecifications: getPanelSpecificationsPreviewFromJson(json.panelSpecifications)
    };
}
