import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { FormFragmentProps } from "../form-fragment-props";
import { FormFragmentWrapper } from "../form-fragment-wrapper/form-fragment-wrapper";

export type ActivationCodeFormFragmentOutput = { activation_code: string };
export type ActivationCodeFormFragmentProps = FormFragmentProps<ActivationCodeFormFragmentOutput>;

export default function ActivationCodeFormFragment(props: ActivationCodeFormFragmentProps) {
    return (
        <FormFragmentWrapper
            position={props.position}
            >
            <RegularInputComponent
                label="Código de Activación"
                type="text"
                placeholder="0123456789ABCDEF"
                register={props.register("activation_code", {
                    required: "El código de activación es necesario",
                })}
                isError={!!props.errors.activation_code}
                errorMessage={props.errors.activation_code?.message}
                />
        </FormFragmentWrapper>
    );
}
