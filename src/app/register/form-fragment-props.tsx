import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export type FormFragmentProps<K extends FieldValues> = {
    register: UseFormRegister<K>;
    errors: FieldErrors<K>;
};
