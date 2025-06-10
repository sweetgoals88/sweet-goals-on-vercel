import { ChangeEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

export type CommonInputProps<K extends string, InputType> = {
    label: string;
    errorMessage?: string;
    isError: boolean;
    register: UseFormRegisterReturn<K>;
    onChange?: ChangeEventHandler<InputType>;
};
