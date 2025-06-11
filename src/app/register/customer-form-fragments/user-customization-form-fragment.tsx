import { UserCustomizationType } from "@/app/api/db/entities/prototype/entity";
import { FormFragmentProps } from "../form-fragment-props";
import { FormFragmentWrapper } from "../form-fragment-wrapper/form-fragment-wrapper";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";

export type UserCustomizationFormFragmentOutput = UserCustomizationType;
export type UserCustomizationFormFragmentProps = FormFragmentProps<UserCustomizationFormFragmentOutput>;

export default function UserCustomizationFormFragment(props: UserCustomizationFormFragmentProps) {
    return (
        <FormFragmentWrapper
            position={props.position}
            >
            <RegularInputComponent
                label="Etiqueta"
                type="text"
                placeholder="Mi panel solar"
                register={props.register("label", {
                    required: "La etiqueta es necesaria",
                })}
                isError={!!props.errors.icon}
                errorMessage={props.errors.icon?.message}
                />
            <RegularInputComponent
                label="Longitud (°)"
                type="number"
                placeholder="63.325"
                register={props.register("longitude", {
                    required: "La longitud es necesaria",
                })}
                isError={!!props.errors.longitude}
                errorMessage={props.errors.longitude?.message}
                />
            <RegularInputComponent
                label="Latitud (°)"
                type="number"
                placeholder="63.325"
                register={props.register("latitude", {
                    required: "La latitud es necesaria",
                })}
                isError={!!props.errors.latitude}
                errorMessage={props.errors.latitude?.message}
                />
        </FormFragmentWrapper>
    );
}
