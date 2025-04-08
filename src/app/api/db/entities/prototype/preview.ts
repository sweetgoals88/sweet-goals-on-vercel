import { ExternalReadingPreview, getExternalReadingPreviewFromJson } from "../external-reading/preview";
import { getInternalReadingPreviewFromJson, InternalReadingPreview } from "../internal-reading/preview";
import { PanelSpecificationsEntity, UserCustomizationIconTypes } from "./entity";

export type PrototypePreview = {
    id: string;
    operational: boolean;
    versionId: string;
    userCustomization: {
        latitude: number;
        longitude: number;
        locationName: string;
        label: string;
        icon: UserCustomizationIconTypes;
    };
    panelSpecifications: PanelSpecificationsPreview;
    internalReadings: InternalReadingPreview[];
    externalReadings: ExternalReadingPreview[];
    oldestInternalReading: string | null;
    oldestExternalReading: string | null;
};

export type PanelSpecificationsPreview = {
    numberOfPanels: number,
    peakVoltage: number,
    temperatureRate: number
};

export function panelSpecificationsEntityToPreview(entity: PanelSpecificationsEntity): PanelSpecificationsPreview {
    return {
        numberOfPanels: entity.number_of_panels,
        peakVoltage: entity.peak_voltage,
        temperatureRate: entity.temperature_rate,
    };
}

export function getPanelSpecificationsPreviewFromJson(json: any): PanelSpecificationsPreview {
    return {
        numberOfPanels: json.numberOfPanels,
        peakVoltage: json.peakVoltage,
        temperatureRate: json.temperatureRate
    };
}

export function getPrototypePreviewFromJson(json: any): PrototypePreview {
    return {
        id: json.id,
        operational: json.operational,
        versionId: json.versionId,
        userCustomization: {
            latitude: json.userCustomization.latitude,
            longitude: json.userCustomization.longitude,
            locationName: json.userCustomization.locationName,
            label: json.userCustomization.label,
            icon: json.userCustomization.icon
        },
        panelSpecifications: getPanelSpecificationsPreviewFromJson(json.panelSpecifications),
        internalReadings: json.internalReadings.map(getInternalReadingPreviewFromJson),
        externalReadings: json.externalReadings.map(getExternalReadingPreviewFromJson),
        oldestInternalReading: json.oldestInternalReading,
        oldestExternalReading: json.oldestExternalReading
    };
}
