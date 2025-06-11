import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { CommonInputProps } from "../common-input-props";
import { v4 } from "uuid";
import styles from "./styles.module.css";

type RegularInputComponentProps<K extends string> = CommonInputProps<K, HTMLInputElement> & {
    placeholder: string;
    type?: HTMLInputTypeAttribute;
};

export default function RegularInputComponent<K extends string>(props: RegularInputComponentProps<K>) {
    const id = v4();
    return (
        <div className={`${props.className} ${styles["regular-input-component__div"]}`} data-is-error={props.isError}>
            <label htmlFor={id}>
                { props.label }
            </label>
            <input 
                type={props.type} 
                placeholder={props.placeholder}
                {...props.register}
                id={id}
                className={styles["regular-input-component__input"]}
                />
            {
                <span className={styles["regular-input-component__error-message"]}>
                    { props.errorMessage }
                </span>
            }
        </div>
    );
}
