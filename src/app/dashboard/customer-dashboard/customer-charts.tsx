import React, { useEffect, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import styles from "./Dashboard.module.css";
import { PrototypePreview } from "@/app/api/db/previews/prototype-preview";

const defaultLayout: Layout[] = [
  { i: "voltage", x: 0, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: "current", x: 4, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: "power", x: 8, y: 0, w: 4, h: 4, static: false, resizeHandles: ["se"] },
  { i: "humidity", x: 0, y: 4, w: 6, h: 4, static: false, resizeHandles: ["se"] },
  { i: "temperature", x: 6, y: 4, w: 6, h: 4, static: false, resizeHandles: ["se"] },
];

const Dashboard: React.FC<{ prototype: PrototypePreview }> = ({ prototype }) => {
  const readings = prototype.externalReadings.map((reading) => ({
    date: new Date(reading.dateTime).toLocaleString(),
    voltage: reading.voltage,
    current: reading.current,
    wattage: reading.wattage,
  }));

  const internal = prototype.internalReadings.map((reading) => ({
    date: new Date(reading.dateTime).toLocaleString(),
    humidity: reading.humidity * 100,
    temperature: reading.temperature,
  }));

  const [layout, setLayout] = useState<Layout[]>(() => {
    const saved = localStorage.getItem("dashboard-layout");
    return saved ? JSON.parse(saved) : defaultLayout;
  });

  useEffect(() => {
    localStorage.setItem("dashboard-layout", JSON.stringify(layout));
  }, [layout]);

  const chartWrapper = (id: string, title: string, data: any[], dataKey: string, unit: string) => (
    <div key={id} className={styles.chartWrapper}>
      <h2 className={styles.chartTitle}>{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <Line type="monotone" dataKey={dataKey} stroke="#8884d8" strokeWidth={2} dot={false} />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" minTickGap={30} />
          <YAxis domain={["auto", "auto"]} unit={unit} />
          <Tooltip />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardGridWrapper}>
        <GridLayout
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
          {chartWrapper("voltage", "Voltage (V)", readings, "voltage", "V")}
          {chartWrapper("current", "Current (Ah)", readings, "current", "Ah")}
          {chartWrapper("power", "Power (Wh)", readings, "wattage", "Wh")}
          {chartWrapper("humidity", "Humidity (%)", internal, "humidity", "%")}
          {chartWrapper("temperature", "Temperature (°C)", internal, "temperature", "°C")}
        </GridLayout>
      </div>
    </div>
  );
};

export default Dashboard;
