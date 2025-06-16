"use client";

import PrototypeListElement from "@/components/prototype-list-element/prototype-list-element";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import styles from "../styles.module.css";
import CustomerCharts from "./customer-charts";
import { CustomerPreview } from "@/app/api/db/entities/user/customer/preview";
import DashboardHeader from "@/components/dashboard-header/dashboard-header";
import { useReadingsWorkers } from "@/utils/use-readings-workers";

export function CustomerDashboard(props: {
  data: CustomerPreview;
  setUserData: Dispatch<SetStateAction<CustomerPreview>>;
}) {
  const [selectedPrototypeIndex, selectSelectedPrototypeIndex] = useState(0);
    const [internalReadingsWorker, externalReadingsWorker] = useReadingsWorkers(
        props.data.prototypes,
        props.setUserData,
        (error: Error) => {
            console.error("Error fetching readings:", error);
        }
    );

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <button className={styles.registerPanel}>
          <span>Registrar Panel</span>
          <Plus size={16} />
        </button>
        <ul className={styles.locationList}>
          {props.data.prototypes.map((prototype, index) => (
            <PrototypeListElement
              key={prototype.id}
              data={prototype}
              isDeletable={props.data.prototypes.length > 1}
              isSelected={index === selectedPrototypeIndex}
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

      <DashboardHeader
        data={{ 
          name: props.data.name, 
          surname: props.data.surname, 
          type: props.data.type 
        }}
        style={{
          gridColumn: "1 / 3",
          gridRow: "1 / 2",
        }}
      />

      <main className={styles.mainContent}>
        {selectedPrototypeIndex < props.data.prototypes.length && (
          <CustomerCharts
            prototype={props.data.prototypes[selectedPrototypeIndex]}
          />
        )}
      </main>
    </div>
  );
}
