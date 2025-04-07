import { OnChangeProps } from "../prototype-list-element";
import { convertIconToComponent } from "@/utils/convert-icon-to-component";
import styles from "./styles.module.css";
import { useState } from "react";
import { UserCustomizationIconTypes } from "@/app/api/db/entities/prototype/entity";

export default function IconFragment(props: OnChangeProps<UserCustomizationIconTypes>) {
    const { onChange, initialValue } = props.props;
    // const [ selectedIcon, setSelectedIcon ] = useState(initialValue);

    const iconOptions: UserCustomizationIconTypes[] = [
      "battery",
      "default",
      "sun",
      "database",
      "microchip"
    ];
  
    return (
        <div>
            <h1 style={{
                fontSize: "1rem"
            }}>
                Selecciona un ícono para tu dispositivo
            </h1>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1px"
            }}>
                {
                    iconOptions.map(icon => {
                        return (
                            <button
                                key={icon} 
                                data-is-selected={icon === initialValue}
                                className={styles.iconButton}
                                onClick={() => onChange(icon)}
                            >
                                {
                                    convertIconToComponent(icon)
                                }
                            </button>
                        );
                    })
                }
            </div>
        </div>
    );
  }
  