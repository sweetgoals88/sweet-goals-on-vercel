import { BsFillInfoCircleFill } from "react-icons/bs";
import { FaUserEdit, FaUserPlus } from "react-icons/fa";
import { IoHome } from "react-icons/io5";

import styles from "./styles.module.css";
import Link from "next/link";

export type NavbarComponentProps = {
    className: string;
};

export function NavbarButton(props: { children: React.ReactNode }) {
  return <button className={styles["navbar-component__button"]}>{props.children}</button>;
}

export default function NavbarComponent() {
  return (
    <nav className={styles["navbar-component"]}>
      <div className={styles["navbar-component__logo-title"]}>
        <img
          src="/images/LOGO.png"
          alt="Logo"
          className={styles["navbar-component__logo"]}
        />
        <h1>Solar Sync</h1>
      </div>
      <ul className={styles["navbar-component__list"]}>
        <li className={styles["navbar-component__list-item"]}>
          <Link href="/">
            <NavbarButton>
              <IoHome />
              <span>Inicio</span>
            </NavbarButton>
          </Link>
        </li>
        <li className={styles["navbar-component__list-item"]}>
          <Link href="/about-us">
            <NavbarButton>
              <BsFillInfoCircleFill /> 
              <span>
                Acerca de Nosotros
              </span>
            </NavbarButton>
          </Link>
        </li>
        <li className={styles["navbar-component__list-item"]}>
          <Link href="/login">
            <NavbarButton>
              <FaUserEdit /> 
              <span>
                Login
              </span>
            </NavbarButton>
          </Link>
        </li>
        <li className={styles["navbar-component__list-item"]}>
          <Link href="/register">
            <NavbarButton>
              <FaUserPlus /> 
              <span>
                Registro
              </span>
            </NavbarButton>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
