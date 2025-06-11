import { SubmitHandler } from "react-hook-form";
import styles from "./styles.module.css";

export type FormFragmentWrapperProps = {
    position: number;
    submitFunction?: SubmitHandler<any>;
    children?: React.ReactNode;
};

export function FormFragmentWrapper(props: FormFragmentWrapperProps) {
    return (
        <div 
            className={styles["form-fragment-wrapper__div"]} 
            style={{ left: `${props.position * 100}%` }}
            >
                <form className={styles["form-fragment-wrapper__form"]} onSubmit={props.submitFunction}>
                    { props.children }
                </form>
        </div>
    );
}
