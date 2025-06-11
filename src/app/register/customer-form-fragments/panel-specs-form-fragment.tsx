import { PanelSpecificationsEntity } from "@/app/api/db/entities/prototype/entity";
import { FormFragmentProps } from "../form-fragment-props";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { FormFragmentWrapper } from "../form-fragment-wrapper/form-fragment-wrapper";

export type PanelSpecsFormFragmentOutput = PanelSpecificationsEntity;
export type PanelSpecsFormFragmentProps = FormFragmentProps<PanelSpecsFormFragmentOutput>;

export default function PanelSpecsFormFragment(props: PanelSpecsFormFragmentProps) {
    return (
        <FormFragmentWrapper
            position={props.position}
            >
            <RegularInputComponent
                label="Número de paneles"
                type="number"
                placeholder="1"
                register={props.register("number_of_panels", {
                    required: "El número de paneles es necesario",
                })}
                isError={!!props.errors.number_of_panels}
                errorMessage={props.errors.number_of_panels?.message}
                />
            <RegularInputComponent
                label="Voltaje pico (V)"
                type="number"
                placeholder="72"
                register={props.register("peak_voltage", {
                    required: "El voltaje pico (V) es necesario",
                })}
                isError={!!props.errors.peak_voltage}
                errorMessage={props.errors.peak_voltage?.message}
                />
            <RegularInputComponent
                label="Coeficiente de temperatura (V/°C)"
                type="number"
                placeholder="0.250"
                register={props.register("temperature_rate", {
                    required: "El coeficiente de temperatura es necesario",
                })}
                isError={!!props.errors.temperature_rate}
                errorMessage={props.errors.temperature_rate?.message}
                />
        </FormFragmentWrapper>
    );
}
