import React, { useEffect, useState } from "react";

import GridLayout, { Layout } from "react-grid-layout";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import styles from "./styles.module.css";
import { PrototypePreview } from "@/app/api/db/entities/prototype/preview";
import ChartComponent from "../chart-component/chart-component";
import ReactGridLayout from "react-grid-layout";

const VOLTAGE_KEY = "voltage";
const CURRENT_KEY = "current";
const POWER_KEY = "power";
const HUMIDITY_KEY = "humidity";
const TEMPERATURE_KEY = "temperature";

const defaultLayout: Layout[] = [
  { i: VOLTAGE_KEY, x: 0, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: CURRENT_KEY, x: 4, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: POWER_KEY, x: 8, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: HUMIDITY_KEY, x: 0, y: 4, w: 6, h: 4, static: false, resizeHandles: ["se"] },
  { i: TEMPERATURE_KEY, x: 6, y: 4, w: 6, h: 4, static: false, resizeHandles: ["se"] },
];

export type DashboardProps = {
  prototype: PrototypePreview;
};

export default function DashboardCharts(props: DashboardProps) {
  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem("dashboard-layout");
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  useEffect(() => {
    localStorage.setItem("dashboard-layout", JSON.stringify(layout));
  }, [layout]);

  return (
    <div className={styles["dashboard-charts__container"]}>
      <div className={styles["dashboard-charts__grid-wrapper"]}>
        <ReactGridLayout
          className="layout"
          layout={layout}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          cols={12}
          rowHeight={100}
          width={1200}
          isDraggable={true}
          isResizable={true}
          margin={[10, 10]}
          containerPadding={[0, 0]}
          compactType="vertical"
          preventCollision={false}
        >
          <div
            key={HUMIDITY_KEY}
            className={styles["dashboard-charts__chart-wrapper"]}
          >
            <ChartComponent 
              title="Humedad"
              chartType="internal"
              data={props.prototype.internalReadings.map(reading => ({ 
                date: reading.dateTime, 
                value: reading.humidity
              }))}
              intendedMaximum={100}
              intendedMinimum={0}
              unit="%"
              />
          </div>

          <div
            key={TEMPERATURE_KEY}
            className={styles["dashboard-charts__chart-wrapper"]}
          >
            <ChartComponent 
              title="Temperatura"
              chartType="internal"
              data={props.prototype.internalReadings.map(reading => ({ 
                date: reading.dateTime, 
                value: reading.temperature
              }))}
              intendedMaximum={40}
              intendedMinimum={-5}
              unit="°C"
              />
          </div>

          <div
            key={CURRENT_KEY}
            className={styles["dashboard-charts__chart-wrapper"]}
          >
            <ChartComponent 
              title="Corriente Eléctrica"
              chartType="external"
              data={props.prototype.externalReadings.map(reading => ({ 
                date: reading.dateTime, 
                value: reading.current 
              }))}
              intendedMaximum={800}
              intendedMinimum={0}
              unit="A"
              />
          </div>

          <div
            key={POWER_KEY}
            className={styles["dashboard-charts__chart-wrapper"]}
          >
            <ChartComponent 
              title="Potencia"
              chartType="external"
              data={props.prototype.externalReadings.map(reading => ({ 
                date: reading.dateTime, 
                value: reading.wattage 
              }))}
              intendedMaximum={800}
              intendedMinimum={0}
              unit="W"
              />
          </div>

          <div
            key={VOLTAGE_KEY}
            className={styles["dashboard-charts__chart-wrapper"]}
          >
            <ChartComponent 
              title="Voltaje"
              chartType="external"
              data={props.prototype.externalReadings.map(reading => ({ 
                date: reading.dateTime, 
                value: reading.voltage 
              }))}
              intendedMaximum={800}
              intendedMinimum={0}
              unit="V"
              />
          </div>
        </ReactGridLayout>
      </div>
    </div>
  );
};
