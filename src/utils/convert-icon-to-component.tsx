import { UserCustomizationIconTypes } from "@/app/api/db/entities/prototype/entity";
import { BatteryCharging, Database, Microchip, Sun, Zap } from "lucide-react";

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
