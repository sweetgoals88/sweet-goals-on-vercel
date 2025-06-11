import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { _UserRegistrationInput } from "../../api/db/entities/user/_user/input";
import { CustomerLabel } from "../../api/db/entities/user/customer/entity";
import { AdminLabel } from "../../api/db/entities/user/admin/entity";
import SelectInputComponent from "@/components/inputs/select-input-component/select-input-component";
import { FormFragmentWrapper } from "../form-fragment-wrapper/form-fragment-wrapper";

import styles from "./styles.module.css";
import { FormFragmentProps } from "../form-fragment-props";
import { UserRegistrationInput } from "@/app/api/db/entities/user/entity";

type UserType = CustomerLabel | AdminLabel | null;

type UserSubformProps = FormFragmentProps<UserRegistrationInput> & {
    userType: string | null;
    onUserTypeChange?: (type: UserType) => void;
};

export default function UserSubform(props: UserSubformProps) {
    return (
        <FormFragmentWrapper
            position={props.position}
            children={(
                <div className={styles["user-subform__input-container"]}>
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
                        className={styles["user-subform__password-input"]}
                    />

                    <SelectInputComponent
                        label="Tipo de usuario"
                        isError={!!props.errors.type}
                        errorMessage={props.errors.type?.message}
                        options={[
                        ["Cliente", "customer"],
                        ["Administrador", "admin"],
                        ]}
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
                        className={styles["user-subform__select-input"]}
                    />
                </div>
            )}
            />
    );
}

