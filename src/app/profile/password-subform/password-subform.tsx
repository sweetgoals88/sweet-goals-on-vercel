import { UserProfileView } from "@/app/api/db/entities/user/profile-view";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { Dispatch, SetStateAction, useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import styles from "./styles.module.css";

export type PasswordSubformProps = {
    errors: FieldErrors<UserProfileView>;
    register: UseFormRegister<UserProfileView>;
    clientUserData: UserProfileView | null;
    setClientUserData: Dispatch<SetStateAction<UserProfileView | null>>;
    className?: string;
};

export default function PasswordSubform(props: PasswordSubformProps) {
    // @todo Add the code that automatically closes the subform when the user clicks outside of it
    const [ isOpen, setIsOpen ] = useState(false);
    return (
        <div className={`${styles["password-subform__container"]} ${props.className}`}>
            <div className={styles["password-subform__inner-div"]}>
                <button type="button" onClick={() => setIsOpen((previous) => !previous)}>
                    <span>Cambiar contraseña</span>
                </button>
                {
                    isOpen && (
                        <div className={styles["password-subform__inputs"]}>
                            <RegularInputComponent
                                type="password"
                                label="Contraseña actual"
                                isError={props.errors.oldPassword !== undefined}
                                errorMessage={props.errors.oldPassword?.message}
                                placeholder="********"
                                register={props.register("oldPassword", {
                                required: "La contraseña actual es obligatoria",
                                })}
                                onChange={(event) => {
                                props.setClientUserData((previous) =>
                                    previous
                                    ? { ...previous, currentPassword: event.target.value }
                                    : null
                                );
                                }}
                            />
                            <RegularInputComponent
                                type="password"
                                label="Nueva contraseña"
                                isError={props.errors.newPassword !== undefined}
                                errorMessage={props.errors.newPassword?.message}
                                placeholder="********"
                                register={props.register("newPassword", {
                                required: "La nueva contraseña es obligatoria",
                                })}
                                onChange={(event) => {
                                props.setClientUserData((previous) =>
                                    previous
                                    ? { ...previous, newPassword: event.target.value }
                                    : null
                                );
                                }}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    );
}