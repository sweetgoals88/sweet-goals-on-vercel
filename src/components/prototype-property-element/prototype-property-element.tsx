import { LucideProps } from "lucide-react";
import styles from "./styles.module.css";
import React from "react";

type Props = {
    children: React.ReactNode;
    onClick?: () => void;
    icon: React.ReactNode;
}

export default function PrototypePropertyElement(
    {
        children,
        onClick,
        icon
    }: Props
) {
    return (
        <li className={`${styles.prototypePropertyElement}`} onClick={onClick}>
            <span className={`${styles.prototypePropertyIcon}`}>
                {icon}
            </span>
            {children}
        </li>
    );
}
