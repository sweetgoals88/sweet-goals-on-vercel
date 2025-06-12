import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

import styles from "./styles.module.css";
import Link from "next/link";

export type ShortNavbarComponentProps = {
    className: string;
};

export function ShortNavbarButton(props: { children: React.ReactNode }) {
  return <button className={styles["short-navbar-component__button"]}>{props.children}</button>;
}

export default function ShortNavbarComponent() {
  return (
    <nav className={styles["short-navbar-component"]}>
      <div className={styles["short-navbar-component__logo-wrapper"]}>
        <img
          src="/images/LOGO.png"
          alt="Logo"
          className={styles["short-navbar-component__logo"]}
        />
        <h1 className={styles["short-navbar-component__logo-title"]}>
            Solar Sync
        </h1>
      </div>
      <ul className={styles["short-navbar-component__list"]}>
        <li className={styles["short-navbar-component__list-item"]}>
          <Link href="/">
            <ShortNavbarButton>
              <IoHome />
              <span>Inicio</span>
            </ShortNavbarButton>
          </Link>
        </li>
        <li className={styles["short-navbar-component__list-item"]}>
          <Link href="/about-us">
            <ShortNavbarButton>
              <BsFillInfoCircleFill /> 
              <span>
                Acerca de Nosotros
              </span>
            </ShortNavbarButton>
          </Link>
        </li>
        <li className={styles["short-navbar-component__list-item"]}>
          <Link href="/login">
            <ShortNavbarButton>
              <FaUserEdit /> 
              <span>
                Login
              </span>
            </ShortNavbarButton>
          </Link>
        </li>
        <li className={styles["short-navbar-component__list-item"]}>
          <Link href="/register">
            <ShortNavbarButton>
              <FaUserPlus /> 
              <span>
                Registro
              </span>
            </ShortNavbarButton>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
