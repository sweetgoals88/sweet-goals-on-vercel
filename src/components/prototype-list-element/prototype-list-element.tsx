import { PrototypePreview } from "@/app/api/db/previews/prototype-preview";
import { BatteryCharging, ChevronLeft, CircleX, Cpu, Ellipsis, LocateFixed, Smile, Sun, Tag, Zap } from "lucide-react";
import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from "react";

import styles from "./styles.module.css";
import ActionButton from "../action-button/action-button";
import PrototypePropertyElement from "../prototype-property-element/prototype-property-element";
import { UserCustomizationIconTypes } from "@/app/api/db/entities/prototype-entity";
import Select, { components } from "react-select";
import IconFragment from "./icon-fragment/icon-fragment";
import { convertIconToComponent } from "@/utils/convert-icon-to-component";
import { getCssVariable } from "@/utils/get-css-variable";
import LabelFragment from "./label-fragment/label-fragment";
import LocationFragment from "./location-fragment/location-fragment";
import SpecificationsFragment from "./specifications-fragment/specifications-fragment";
import { useMemo } from "react";

const MINI_FORM_INNER_WIDTH = "15vw";

export type OnChangeHandler<T> = Dispatch<SetStateAction<T>>;
export type OnChangeProps<T> = {
  props: {
    onChange: OnChangeHandler<T>;
    initialValue: T;
  };
};
type MiniFormState<T> = {
  component: FunctionComponent<OnChangeProps<T>>;
  onChange: OnChangeHandler<T>;
  initialValue: T;
};

export default function PrototypeListElement(props: {
  data: PrototypePreview;
  isDeletable?: boolean;
}) {
  const prototype = props.data;
  const [isOpen, setIsOpen] = useState(false);

  const [miniFormState, setMiniFormState] = useState<MiniFormState<any> | null>(
    null
  );
  const [miniFormIsOpen, setMiniFormIsOpen] = useState(false);

  const [icon, setIcon] = useState<UserCustomizationIconTypes>(
    prototype.userCustomization.icon
  );
  const [label, setLabel] = useState(prototype.userCustomization.label);
  const [location, setLocation] = useState({
    latitude: prototype.userCustomization.latitude,
    longitude: prototype.userCustomization.longitude,
    locationName: prototype.userCustomization.locationName,
  });
  const [specifications, setSpecifications] = useState(
    prototype.panelSpecifications
  );

  const isModified = useMemo(() => {
    return (
      icon !== prototype.userCustomization.icon ||
      label !== prototype.userCustomization.label ||
      location.latitude !== prototype.userCustomization.latitude ||
      location.longitude !== prototype.userCustomization.longitude ||
      location.locationName !== prototype.userCustomization.locationName ||
      JSON.stringify(specifications) !== JSON.stringify(prototype.panelSpecifications)
    );
  }, [icon, label, location, specifications, prototype]);
  

  const openMiniForm = <T,>(
    component: FunctionComponent<OnChangeProps<T>>,
    onChange: Dispatch<SetStateAction<T>>,
    initialValue: T
  ) => {
    setMiniFormIsOpen(true);
    setMiniFormState({ component, onChange, initialValue });
  };

  return (
    <li
      key={prototype.id}
      style={{
        display: "flex",
        position: "relative",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span>{convertIconToComponent(icon)}</span>
      <span
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {label}
      </span>
      <button
        onClick={() => {
            setIsOpen(!isOpen);
            if (isOpen) {
                setMiniFormIsOpen(false);
                setIcon(prototype.userCustomization.icon);
                setLabel(prototype.userCustomization.label);
                setLocation({
                    latitude: prototype.userCustomization.latitude,
                    longitude: prototype.userCustomization.longitude,
                    locationName: prototype.userCustomization.locationName,
                });
                setSpecifications({...prototype.panelSpecifications});
            }
        }}
        style={{
          boxShadow: "none",
          padding: "4px",
        }}
      >
        {isOpen ? <CircleX /> : <Ellipsis />}
      </button>
      <div
        style={{
          position: "absolute",
          left: "100%",
          top: "0",
          opacity: isOpen ? "1" : "0",
          pointerEvents: isOpen ? "all" : "none",
          transition: "opacity 0.2s ease-in-out",
          isolation: "isolate",
          backgroundColor: "white",
          padding: "12px",
          zIndex: isOpen ? "5" : "0",
          boxShadow: "0 15px 20px #1a5f8566",
          borderRadius: "8px",
          width: "fit-content",
        }}
      >
        <div>
          <div style={{
            maxHeight: miniFormIsOpen? "10vh": "0",
            transition: "100ms ease-in-out max-height"
          }}>
            <button
              style={{
                boxShadow: "none",
                padding: "4px",
              }}
              onClick={() => setMiniFormIsOpen(false)}
            >
                <ChevronLeft/>
            </button>
          </div>
          <div
            style={{
              display: "flex",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <PropertyListGroup
              onIconChange={() => {}}
              onLabelChange={() => {}}
              onLocationChange={() => {}}
              onSpecificationsChange={() => {}}
            />
            <div
              style={{
                position: "absolute",
                top: "0",
                width: "max-content",
                backgroundColor: "white",
                display: "flex",
                left: miniFormIsOpen ? "-100%" : "0",
                transition: "250ms ease-in-out left",
              }}
            >
              <PropertyListGroup
                onIconChange={() => openMiniForm(IconFragment, setIcon, icon)}
                onLabelChange={() => openMiniForm(LabelFragment, setLabel, label)}
                onLocationChange={() => openMiniForm(LocationFragment, setLocation, location)}
                onSpecificationsChange={() => {openMiniForm(SpecificationsFragment, setSpecifications, specifications)}}
              />
              <div
                style={{
                  width: MINI_FORM_INNER_WIDTH,
                }}
              >
                {miniFormState && (
                  <miniFormState.component
                    props={{ 
                        onChange: (value) => {
                            miniFormState.onChange(value);
                            setMiniFormState({
                                component: miniFormState.component,
                                onChange: miniFormState.onChange,
                                initialValue: value
                            });
                        }, 
                        initialValue: miniFormState.initialValue 
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              justifyContent: "space-between",
              marginTop: "32px",
            }}
          >
            <ActionButton backgroundColor="red" isActive={props.isDeletable}>
              Eliminar
            </ActionButton>
            <ActionButton backgroundColor="light-green" isActive={isModified}>
              Actualizar
            </ActionButton>
          </div>
        </div>
      </div>
    </li>
  );
}

function PropertyListGroup(
  props: React.HTMLAttributes<HTMLUListElement> & {
    onIconChange: () => void;
    onLabelChange: () => void;
    onLocationChange: () => void;
    onSpecificationsChange: () => void;
  }
) {
  return (
    <ul
      style={{
        listStyleType: "none",
        padding: "0",
        margin: "0",
        width: MINI_FORM_INNER_WIDTH,
      }}
    >
      <PrototypePropertyElement onClick={props.onIconChange} icon={<Smile />}>
        Ícono
      </PrototypePropertyElement>
      <PrototypePropertyElement onClick={props.onLabelChange} icon={<Tag />}>
        Etiqueta
      </PrototypePropertyElement>
      <PrototypePropertyElement onClick={props.onSpecificationsChange} icon={<Cpu />}>
        Especificaciones
      </PrototypePropertyElement>
      <PrototypePropertyElement onClick={props.onLocationChange} icon={<LocateFixed />}>
        Ubicación
      </PrototypePropertyElement>
    </ul>
  );
}
