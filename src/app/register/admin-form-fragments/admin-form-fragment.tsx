import { AdminRegistrationInputFragment } from "@/app/api/db/entities/user/admin/input";
import { FormFragmentProps } from "../form-fragment-props";
import { FormFragmentWrapper } from "../form-fragment-wrapper/form-fragment-wrapper";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";

export type AdminFormFragmentOutput = Omit<AdminRegistrationInputFragment, "type">;
export type AdminFormFragmentProps = FormFragmentProps<AdminFormFragmentOutput>;

export default function AdminFormFragment(props: AdminFormFragmentProps) {
    return (
        <FormFragmentWrapper
            position={props.position}
            >
            <RegularInputComponent
                label="Correo del Administrador Anfitrión"
                type="text"
                placeholder="administrador@email.com"
                register={props.register("adminEmail", {
                    required: "El correo del anfitrión es obligatorio",
                })}
                isError={!!props.errors.adminEmail}
                errorMessage={props.errors.adminEmail?.message}
                />
            <RegularInputComponent
                label="Código del Administrador Anfitrión"
                type="text"
                placeholder="ABCD1234"
                register={props.register("adminCode", {
                    required: "El código del anfitrión es obligatorio",
                })}
                isError={!!props.errors.adminCode}
                errorMessage={props.errors.adminCode?.message}
                />
        </FormFragmentWrapper>
    );
}
