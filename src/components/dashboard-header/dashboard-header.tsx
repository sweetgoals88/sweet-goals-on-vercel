import Image from "next/image";
import styles from "./styles.module.css";
import { Bell, HelpCircle, User } from "lucide-react";
import { UserPreview } from "@/app/api/db/entities/user/preview";
import React, { useRef, useState } from "react";
import { useOutsideAlerter } from "@/utils/use-outside-alerter";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { useRouter } from "next/navigation";
import apiCall from "@/utils/api-call";
import Link from "next/link";
import { AdminLabel } from "@/app/api/db/entities/user/admin/entity";
import { CustomerLabel } from "@/app/api/db/entities/user/customer/entity";

type DashboardHeaderProps = React.HTMLAttributes<HTMLHeadingElement> & {
  data: {
    name: string;
    surname: string;
    type: AdminLabel | CustomerLabel;
  };
};

export default function DashboardHeader({ data, ...rest }: DashboardHeaderProps) {
  const { className: additionalClassNames, ..._rest } = rest;
  return (
    <header className={`${styles.dashboardHeader} ${additionalClassNames}`} {..._rest}>
      <div
        style={{
          height: "48px",
          position: "relative",
          aspectRatio: "1 / 1",
          marginRight: "auto",
        }}
      >
        <Image src={"/images/LOGO.png"} alt="Logo de Solar Sync" fill />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div className={styles.headerIcons}>
          <HelpCircle size={20} />
          <Bell size={20} className={styles.notificationIcon} />
        </div>
        <UserInfoButton name={data.name} surname={data.surname} />
      </div>
    </header>
  );
}

type UserInfoButtonProps = {
  name: string;
  surname: string;
};

export function UserInfoButton({ name, surname }: UserInfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reference = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOutsideAlerter(reference, () => {
    setIsOpen(false);
  });

  return (
    <div className={styles.userInfoWrapper} ref={reference}>
      <div className={styles.userInfo} onClick={() => setIsOpen(!isOpen)}>
        <User size={24} />
        <span style={{ pointerEvents: "none" }}>{`${name} ${surname}`}</span>
      </div>
      <div
        className={styles.optionsPanel}
        style={{
          maxHeight: isOpen ? "25vh" : "0",
          opacity: isOpen ? "1" : "0",
          top: isOpen ? "calc(100% + 12px)" : "95%",
        }}
      >
        <ul className={styles.optionsPanelList}>
          <li className={styles.option}>
            <Link href={"/profile"}>
              Ver perfil
            </Link>
          </li>
          <li className={`${styles.option} ${styles.logoutOption}`}>
            <button
              onClick={async () => {
                try {
                  await apiCall(API_ENDPOINTS.USER.LOGOUT);
                  router.push("/login");
                } catch (error) {
                  console.error("Error trying to log out", error);
                }
              }}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
