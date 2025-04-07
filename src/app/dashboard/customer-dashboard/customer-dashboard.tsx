import { CustomerPreview } from "@/app/api/db/previews/user-preview";
import PrototypeListElement from "@/components/prototype-list-element/prototype-list-element";
import { Bell, HelpCircle, Plus, User } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import styles from "../styles.module.css";
import CustomerCharts from "./customer-charts";
import Image from 'next/image';

export function CustomerDashboard(props: {
  data: CustomerPreview;
  setUserData: Dispatch<SetStateAction<CustomerPreview>>;
}) {
  const [selectedPrototypeIndex, selectSelectedPrototypeIndex] = useState(0);

  return (
    <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
            <button className={styles.registerPanel}>
            Registrar Panel <Plus size={16} />
            </button>
            <ul className={styles.locationList}>
            {props.data.prototypes.map((prototype, index) => (
                <PrototypeListElement
                key={prototype.id}
                data={prototype}
                isDeletable={props.data.prototypes.length > 1}
                editPrototype={(prototypeData) => {
                    const prototypesArray = [...props.data.prototypes];
                    prototypesArray[index] = prototypeData;
                    props.setUserData({
                    email: props.data.email,
                    id: props.data.id,
                    name: props.data.name,
                    notifications: props.data.notifications,
                    oldestNotification: props.data.oldestNotification,
                    prototypes: prototypesArray,
                    surname: props.data.surname,
                    type: props.data.type,
                    });
                }}
                deletePrototype={() => {
                    const prototypesArray = props.data.prototypes.filter(
                    (value, localIndex) => localIndex != index
                    );
                    if (index === selectedPrototypeIndex) {
                    selectSelectedPrototypeIndex(
                        props.data.prototypes.length - 2
                    );
                    }
                    props.setUserData({
                    email: props.data.email,
                    id: props.data.id,
                    name: props.data.name,
                    notifications: props.data.notifications,
                    oldestNotification: props.data.oldestNotification,
                    prototypes: prototypesArray,
                    surname: props.data.surname,
                    type: props.data.type,
                    });
                }}
                onClick={() => selectSelectedPrototypeIndex(index)}
                />
            ))}
            </ul>
            <div className={styles.downloadSectionBorder}>
            <div className={styles.downloadSection}>
                <p>Descarga la app</p>
                <div className={styles.downloadIcons}>
                <FaApple size={32} color="white" />
                <FaGooglePlay size={32} color="white" />
                </div>
            </div>
            </div>
        </aside>

        <header className={styles.dashboardHeader}>
            <div style={{
                height: "48px",
                position: "relative",
                aspectRatio: "1 / 1",
                marginRight: "auto"
            }}>
                <Image 
                    src={"/images/LOGO.png"}
                    alt="Logo de Solar Sync"
                    fill
                    />
            </div>
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
            }}>
                <div className={styles.headerIcons}>
                    <HelpCircle size={20} />
                    <Bell size={20} className={styles.notificationIcon} />
                </div>
                <div className={styles.userInfo}>
                    <User size={24} />
                    <span>{`${props.data.name} ${props.data.surname}`}</span>
                </div>
            </div>
        </header>
        {/* Main Content */}
        <main className={styles.mainContent}>
            <CustomerCharts 
                prototype={props.data.prototypes[selectedPrototypeIndex]}
                />
        </main>
    </div>
  );
}
