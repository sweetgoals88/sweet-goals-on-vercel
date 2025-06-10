import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CommonInputProps } from "../common-input-props";

type RegularInputComponentProps<K extends string> = CommonInputProps<K, HTMLInputElement> & {
    placeholder: string;
    type?: HTMLInputTypeAttribute;
};

export default function RegularInputComponent<K extends string>(props: RegularInputComponentProps<K>) {
    return (
        <div className="">
            <label htmlFor="">
                { props.label }
            </label>
            <input 
                type={props.type} 
                placeholder={props.placeholder}
                {...props.register}
                />
            {
                props.isError && (
                    <span>
                        { props.errorMessage }
                    </span>
                )
            }
        </div>
    );
}
