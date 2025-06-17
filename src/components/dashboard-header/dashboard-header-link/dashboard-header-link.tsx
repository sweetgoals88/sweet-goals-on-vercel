import { LucideProps } from "lucide-react";
import Link from "next/link";
import React from "react";
import styles from "./styles.module.css";

export type DashboardHeaderLinkProps = {
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
    href: string;
}

export default function DashboardHeaderLink(props: DashboardHeaderLinkProps) {
  return (
    <Link
      href={props.href}
      className={styles["dashboard-header-link__link"]}
      >
        <props.icon size={20} />
    </Link>
  );
}
