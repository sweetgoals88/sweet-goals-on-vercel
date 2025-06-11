import { CommonInputProps } from "../common-input-props";
import { v4 } from "uuid";

import styles from "./styles.module.css";

type SelectInputComponentProps<K extends string> = CommonInputProps<K, HTMLSelectElement> & {
    options: [name: string, value: string][];
    textForInvalidOption?: string;
    selectedOption?: string;
};

export const VALUE_OF_INVALID_OPTION = "";

export default function SelectInputComponent<K extends string>(props: SelectInputComponentProps<K>) {
    const id = v4();

    const textForDefaultOption = props.textForInvalidOption ?? "Selecciona...";
    const options = [
        [ textForDefaultOption, VALUE_OF_INVALID_OPTION ],
        ...props.options
    ];

    return (
        <div 
            className={`${props.className} ${styles["select-input-component__div"]}`}
            >
            <label htmlFor={id}>
                { props.label }
            </label>
            <select
                {...props.register}
                onChange={props.onChange}
                value={
                    props.selectedOption !== undefined ?
                    props.selectedOption : 
                    VALUE_OF_INVALID_OPTION
                }
                id={id}
                className={styles["select-input-component__select"]}
                >
                {
                    options.map(([name, value]) => (
                        <option 
                            key={value} 
                            value={value}
                            >
                            { name }
                        </option>
                    ))
                }
            </select>
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
