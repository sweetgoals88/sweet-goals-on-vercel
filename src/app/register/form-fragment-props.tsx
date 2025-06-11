import { FieldErrors, FieldValues, SubmitHandler, UseFormRegister } from "react-hook-form";

export type FormFragmentProps<K extends FieldValues> = {
    register: UseFormRegister<K>;
    errors: FieldErrors<K>;
    position: number;
    submitFunction?: SubmitHandler<any>;
};
