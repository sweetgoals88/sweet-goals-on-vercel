import { CommonInputProps } from "../common-input-props";

type SelectInputComponentProps<K extends string> = CommonInputProps<K, HTMLSelectElement> & {
    options: [name: string, value: string][];
    textForInvalidOption?: string;
    selectedOption?: string;
};

export const VALUE_OF_INVALID_OPTION = "";

export default function SelectInputComponent<K extends string>(props: SelectInputComponentProps<K>) {
    const textForDefaultOption = props.textForInvalidOption ?? "Selecciona...";
    const options = [
        [ textForDefaultOption, VALUE_OF_INVALID_OPTION ],
        ...props.options
    ];

    return (
        <div className="">
            <label htmlFor="">
                { props.label }
            </label>
            <select
                {...props.register}
                onChange={props.onChange}
                defaultValue={
                    props.selectedOption !== undefined ?
                    props.selectedOption : 
                    VALUE_OF_INVALID_OPTION
                }
                >
                {
                    options.map(([name, value]) => (
                        <option 
                            key={name} 
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
