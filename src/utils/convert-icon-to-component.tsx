import { UserCustomizationIconTypes } from "@/app/api/db/entities/prototype-entity";
import { BatteryCharging, ChevronLeft, CircleX, Database, Ellipsis, Microchip, Sun, Zap } from "lucide-react";
import { getCssVariable } from "./get-css-variable";

export function convertIconToComponent(icon: UserCustomizationIconTypes) {
    switch (icon) {
    case "battery":
        return <BatteryCharging/>;
    case "sun":
        return <Sun/>;
    case "default":
        return <Zap/>;
    case "database":
        return <Database />;
    case "microchip":
        return <Microchip />;
    }
}
