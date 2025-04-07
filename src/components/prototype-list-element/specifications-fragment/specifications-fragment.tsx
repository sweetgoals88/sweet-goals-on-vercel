import { PanelSpecificationsPreview } from "@/app/api/db/entities/prototype/preview";
import { OnChangeProps } from "../prototype-list-element";
import { ChangeEventHandler } from "react";

export default function SpecificationsFragment(
    props: OnChangeProps<PanelSpecificationsPreview>
) {
    return (
        <div>
            <h1 style={{
                fontSize: "1rem"
            }}>
                Ingresa las especificaciones de tu panel
            </h1>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                boxSizing: "border-box",
                width: "100%",
                gap: "1rem"
            }}>

                <SpecificationsParameter props={{
                    title: "Vmp",
                    definition: "El voltaje máximo que puede generar el panel.",
                    value: props.props.initialValue.peakVoltage,
                    onChange: (event) => props.props.onChange({
                        ...props.props.initialValue,
                        peakVoltage: event.target.valueAsNumber
                    })
                }} />
                <SpecificationsParameter props={{
                    title: "CF",
                    definition: "El cambio en eficiencia por grado de temperatura.",
                    value: props.props.initialValue.temperatureRate,
                    onChange: (event) => props.props.onChange({
                        ...props.props.initialValue,
                        temperatureRate: event.target.valueAsNumber
                    })
                }} />
                <SpecificationsParameter props={{
                    title: "No.",
                    definition: "La cantidad total de paneles en el sistema.",
                    value: props.props.initialValue.numberOfPanels,
                    onChange: (event) => props.props.onChange({
                        ...props.props.initialValue,
                        numberOfPanels: event.target.valueAsNumber
                    })
                }} />
            </div>
        </div>
    );
}

function SpecificationsParameter(props: {
    props: {
        title: string,
        definition: string,
        value: number,
        onChange: ChangeEventHandler<HTMLInputElement>
    }
}) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            boxSizing: "border-box",
            gap: "4px"
        }}>
            <abbr title={props.props.definition} style={{
                textAlign: "center"
            }}>
                { props.props.title }
            </abbr>
            <input type="number" value={props.props.value} onChange={props.props.onChange} style={{
                width: "100%",
                boxSizing: "border-box",
                aspectRatio: "4 / 3",
                borderRadius: "5px",
                border: "1px solid #a0a0a0",
                fontSize: "1rem",
                textAlign: "center",
                outline: "none",
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                fontFamily: "Montserrat"
            }}/>
        </div>
    )
}
