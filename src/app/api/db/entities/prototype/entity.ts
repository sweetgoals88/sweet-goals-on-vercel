export type PanelSpecificationsEntity = {
  number_of_panels: number, // unidades
  peak_voltage: number, // voltios; Vpm
  temperature_rate: number
};

export type UserCustomizationType = {
  latitude: number,
  longitude: number,
  label: string,
  icon: UserCustomizationIconTypes,
};

export type UserCustomizationIconTypes = "default" | "battery" | "sun" | "database" | "microchip";

export type PrototypeEntity = {
    _id?: string,
    key: string,
    active: boolean,
    operational: boolean,
    activation_code: string,
    external_readings: string[],
    internal_readings: string[],
    version_id: string,
    user_customization: UserCustomizationType,
    panel_specifications: PanelSpecificationsEntity
};

