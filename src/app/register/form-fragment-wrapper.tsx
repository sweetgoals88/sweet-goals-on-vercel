import { FieldValues, useForm } from "react-hook-form";
import { FormFragmentProps } from "./form-fragment-props";
import { JSX, useEffect } from "react";

type FormFragmentWrapperProps<K extends FieldValues> = {
    position: number;
    isLast: boolean;
    inputs: (props: FormFragmentProps<K>) => JSX.Element;

    goBack: () => void;
    onSuccess: (data: object) => void;
    onError: () => void;
};

export default function FormFragmentWrapper<K extends FieldValues>(props: FormFragmentWrapperProps<K>) {
    const isFirst = props.position === 0;
    const {
        register,
        handleSubmit,
        watch,
        formState,
    } = useForm<K>();
    
    const handling = handleSubmit(props.onSuccess, props.onError);

    // useEffect(() => {
        console.log("is first?", isFirst);
        console.log("is last?", props.isLast);
    // });

    return (
        <div 
            className="absolute top-0 w-full h-full flex items-center justify-center" 
            style={{ left: `${props.position * 100}%` }}
            >
                <form onSubmit={handling}>
                    <props.inputs 
                        register={register}
                        errors={formState.errors}
                        />
                    <div>
                        {
                            !isFirst && (
                                <button 
                                    onClick={props.goBack}
                                    type="submit"
                                    >
                                    Regresar
                                </button>
                            )
                        }
                        {
                            !props.isLast && (
                                <button onClick={props.onSuccess}>
                                    Siguiente
                                </button>
                            )
                        }
                    </div>
                </form>
        </div>
    );
}
