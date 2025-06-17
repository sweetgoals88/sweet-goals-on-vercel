import { TooltipProps } from "recharts/types/component/Tooltip";
import styles from "./styles.module.css";

export type CustomTooltipType = TooltipProps<number, string> & {
    name: string;
    unit: string;
};

export default function CustomTooltip(props: CustomTooltipType) {
    const date = new Date(parseInt(props.label)).toLocaleTimeString();

    if (props.active) {
        return (
            <section className={styles["custom-tooltip__container"]}>
                <p className={styles["custom-tooltip__unit-name"]}>
                    { props.name }
                </p>
                <p className={styles["custom-tooltip__reading"]}>
                    { props.payload?.at(0)?.value }
                    { props.unit }
                </p>
                <p className={styles["custom-tooltip__date"]}>
                    { date }
                </p>
            </section>
        );
    }
}