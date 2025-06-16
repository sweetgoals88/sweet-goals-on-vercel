import { UserProfileView } from "@/app/api/db/entities/user/profile-view";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { register } from "module";
import { Dispatch, SetStateAction } from "react";
import { FieldErrors, UseFormHandleSubmit, UseFormRegister } from "react-hook-form";
import styles from "./styles.module.css";
import PasswordSubform from "../password-subform/password-subform";

export type ProfileFormProps = {
    errors: FieldErrors<UserProfileView>;
    register: UseFormRegister<UserProfileView>;
    clientUserData: UserProfileView | null;
    setClientUserData: Dispatch<SetStateAction<UserProfileView | null>>;
    handleSubmit: UseFormHandleSubmit<UserProfileView, UserProfileView>;
    isDataEdited: boolean;
    className?: string;
};

export default function ProfileForm(props: ProfileFormProps) {
  return (
    <form
      onSubmit={props.handleSubmit(async (data) => {
        if (!props.isDataEdited) {
          return;
        }
      })}
      className={`${props.className} ${styles["profile-form__form"]}`}
    >
      <RegularInputComponent
        value={props.clientUserData?.name || ""}
        label="Nombre"
        isError={props.errors.name !== undefined}
        errorMessage={props.errors.name?.message}
        placeholder="Juan"
        register={props.register("name", { required: "El nombre es obligatorio" })}
        onChange={(event) => {
          props.setClientUserData((previous) =>
            previous ? { ...previous, name: event.target.value } : null
          );
        }}
      />
      <RegularInputComponent
        value={props.clientUserData?.surname || ""}
        label="Apellidos"
        isError={props.errors.surname !== undefined}
        errorMessage={props.errors.surname?.message}
        placeholder="Pérez López"
        register={props.register("surname", {
          required: "Los apellidos son obligatorios",
        })}
        onChange={(event) => {
          props.setClientUserData((previous) =>
            previous ? { ...previous, surname: event.target.value } : null
          );
        }}
      />
      <RegularInputComponent
        value={props.clientUserData?.email || ""}
        label="Correo electrónico"
        isError={props.errors.email !== undefined}
        errorMessage={props.errors.email?.message}
        placeholder="alguien@mail.com"
        register={props.register("email", {
          required: "El correo electrónico es obligatorio",
        })}
        onChange={(event) => {
          props.setClientUserData((previous) =>
            previous ? { ...previous, email: event.target.value } : null
          );
        }}
        className={styles["profile-form__email-input"]} // Custom class for email input
      />

      <PasswordSubform 
        clientUserData={props.clientUserData}
        errors={props.errors}
        register={props.register}
        setClientUserData={props.setClientUserData}
        className={styles["profile-form__password-subform"]} // Custom class for password subform
        />

      <button 
        type="submit" 
        disabled={!props.isDataEdited}
        className={styles["profile-form__submit-button"]}
        >
        Enviar datos
      </button>
    </form>
  );
}
