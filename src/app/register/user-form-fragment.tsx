import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { useForm } from "react-hook-form";
import { _UserRegistrationInput } from "../api/db/entities/user/_user/input";
import { CustomerLabel } from "../api/db/entities/user/customer/entity";
import { AdminLabel } from "../api/db/entities/user/admin/entity";
import { FormFragmentProps } from "./form-fragment-props";
import SelectInputComponent from "@/components/inputs/select-input-component/select-input-component";

type UserFormFragmentProps = FormFragmentProps<
  _UserRegistrationInput & { type: CustomerLabel | AdminLabel }
> & {
    userType: string | null;
    onUserTypeChange?: (type: CustomerLabel | AdminLabel | null) => void;
};

export default function UserFormFragment(props: UserFormFragmentProps) {
  return (
    <>
      <RegularInputComponent
        label="Nombre"
        type="text"
        placeholder="Juan"
        register={props.register("name", {
          required: "El nombre es obligatorio",
        })}
        isError={!!props.errors.name}
        errorMessage={props.errors.name?.message}
      />

      <RegularInputComponent
        label="Apellido"
        type="text"
        placeholder="Pérez Hernández"
        register={props.register("surname", {
          required: "El apellido es obligatorio",
        })}
        isError={!!props.errors.surname}
        errorMessage={props.errors.surname?.message}
      />

      <RegularInputComponent
        label="Correo"
        type="email"
        placeholder="alguien@gmail.com"
        register={props.register("email", {
          required: "El correo es obligatorio",
          pattern: {
            value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/,
            message: "Correo inválido",
          },
        })}
        isError={!!props.errors.email}
        errorMessage={props.errors.email?.message}
      />

      <RegularInputComponent
        label="Contraseña"
        type="password"
        placeholder="*****"
        register={props.register("password", {
          required: "La contraseña es obligatoria",
          minLength: {
            value: 6,
            message: "Mínimo 6 caracteres",
          },
        })}
        isError={!!props.errors.password}
        errorMessage={props.errors.password?.message}
      />

      <SelectInputComponent
        label="Tipo de usuario"
        isError={!!props.errors.type}
        errorMessage={props.errors.type?.message}
        options={[
          ["Cliente", "customer"],
          ["Administrador", "admin"],
        ] as [ string, AdminLabel | CustomerLabel ][]}
        register={props.register("type", {
          required: "Selecciona un tipo de usuario",
        })}
        selectedOption={props.userType === null? "": props.userType}
        onChange={(event) => {
            if (props.onUserTypeChange !== undefined) {
                const value = event.target.value;
                if (value === "") {
                    return props.onUserTypeChange(null);
                }
                props.onUserTypeChange(event.target.value as CustomerLabel | AdminLabel);
            };
        }}
      />
    </>
  );
}
