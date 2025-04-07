import { getCssVariable } from "@/utils/get-css-variable";
import { desaturateHex } from "@/utils/desaturate-hex";

import styles from "./styles.module.css";

type CascadingProps = React.HTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode, 
    onClick?: () => void,
    backgroundColor?: "red" | "light-green" | "dark-green",
    isActive?: boolean
};

export default function ActionButton(
    { children, backgroundColor, isActive, ...rest }: CascadingProps
) {
    if (isActive === undefined) isActive = true;
    if (backgroundColor === undefined) backgroundColor = "light-green";

    const initialBackgroundColor = getCssVariable(`--${backgroundColor}`);
    const finalBackgroundColor = isActive? initialBackgroundColor: desaturateHex(initialBackgroundColor, 0.5);

    return (
        <button className={`${styles.actionButton}`} style={{
            backgroundColor: finalBackgroundColor,
            padding: "12px 32px",
            boxSizing: "border-box",
            boxShadow: "none"   
        }}
        {...rest}
        data-is-active={isActive? "true" : "false"}
        >
            { children }
        </button>
    );
}