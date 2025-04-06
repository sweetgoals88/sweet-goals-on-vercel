'use client';

import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,  XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts";

import { Home, Plus, Bell, User, HelpCircle, Sun, BatteryCharging } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import styles from "./styles.module.css";
import { API_ENDPOINTS } from "../api/endpoints";
import { CustomerPreview, getCustomerPreviewFromJson, UserPreview } from "../api/db/previews/user-preview";
import PrototypeListElement from "@/components/prototype-list-element/prototype-list-element";

export default function DashboardPage() {
    const [userData, setUserData] = useState<UserPreview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.USER.GET_DASHBOARD_DATA, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const json = await response.json();
                console.log(json);
                const data = getCustomerPreviewFromJson(json);
                setUserData(data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Cargando...</p>;

    if (userData?.type === "customer") return <CustomerDashboard data={userData}/>;
    if (userData?.type === "admin") return <AdminTable />;
    return <p>Rol desconocido.</p>;
}


function CustomerDashboard(props: { data: CustomerPreview }) {

    // Estado para las gráficas dinámicas
    const [data, setData] = useState([
      { name: "A", value: 10 },
      { name: "B", value: 34 },
      { name: "C", value: 23 },
      { name: "D", value: 80 },
      { name: "E", value: 90 },
    ]);
  
    const [pieData, setPieData] = useState([
      { name: "Porción 1", value: 77 },
      { name: "Porción 2", value: 23 },
    ]);
  
    const colors = ["#1D3557", "#2ECC71"];
  
    // Función para actualizar los valores de las gráficas
    useEffect(() => {
      const interval = setInterval(() => {
        setData([
          { name: "A", value: Math.floor(Math.random() * 90) + 10 },
          { name: "B", value: Math.floor(Math.random() * 90) + 10 },
          { name: "C", value: Math.floor(Math.random() * 90) + 10 },
          { name: "D", value: Math.floor(Math.random() * 90) + 10 },
          { name: "E", value: Math.floor(Math.random() * 90) + 10 },
        ]);
  
        setPieData([
          { name: "Porción 1", value: Math.floor(Math.random() * 100) },
          { name: "Porción 2", value: Math.floor(Math.random() * 100) },
        ]);
      }, 5000); // Se actualiza cada 5 segundos
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div className={styles.dashboardContainer}>
        <aside className={styles.sidebar}>
          <button className={styles.registerPanel}>
            Registrar Panel <Plus size={16} />
          </button>
          <ul className={styles.locationList}>
            {
                props.data.prototypes.map((prototype) => (
                    <PrototypeListElement key={prototype.id} data={prototype} isDeletable={props.data.prototypes.length > 1} />
                ))
            }
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
  
        {/* Main Content */}
        <main className={styles.mainContent}>
          {/* Header */}
          <header className={styles.dashboardHeader}>
            <div className={styles.headerIcons}>
              <HelpCircle size={20} />
              <Bell size={20} className={styles.notificationIcon} />
            </div>
            <div className={styles.userInfo}>
              <User size={24} />
              <span>
                {
                    `${props.data.name} ${props.data.surname}`
                }
              </span>
            </div>
          </header>
  
          {/* Dashboard */}
          <div className={styles.dashboardGrid}>
            {/* Line Chart */}
            <div className={styles.chartCard}>
              <h3>📈 Tendencia de Datos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#2ECC71" strokeWidth={3}>
                    <LabelList dataKey="value" position="top" />
                  </Line>
                </LineChart>
              </ResponsiveContainer>
            </div>
  
            {/* Pie Chart */}
            <div className={`${styles.chartCard} ${styles.pieChart}`}>
              <h3>🎯 Distribución de Datos</h3>
              <PieChart width={200} height={200}>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={70} label>
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={colors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
  
            {/* Bar Chart */}
            <div className={`${styles.chartCard} ${styles.barChart}`}>
              <h3>📊 Comparación de Datos</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#1D3557">
                    <LabelList dataKey="value" position="top" />
                    {data.map((_, index) => (
                      <Cell key={index} fill={index % 2 ? "#2ECC71" : "#1D3557"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    );
  }
  

  function AdminTable() {
    // Esto se puede conectar luego a una API para obtener usuarios
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Vista de Administrador</h1>
            <table border={1} cellPadding="10" style={{ marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Usuario de ejemplo</td>
                        <td>correo@ejemplo.com</td>
                    </tr>
                    {/* Aquí puedes mapear una lista real más adelante */}
                </tbody>
            </table>
        </div>
    );
}