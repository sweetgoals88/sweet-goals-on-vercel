"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

import React from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,  XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts";

import { Home, Plus, Bell, User, HelpCircle, Sun, BatteryCharging } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";



export default function AuthPage() {
    const [mensaje, setMensaje] = useState("");
    const [userData, setUserData] = useState<{ token: string, role: string } | null>(null);
    const { register, handleSubmit, reset, setFocus } = useForm<{ username: string; password: string }>();

    const login = async ({ username, password }: { username: string; password: string }) => {
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

            setUserData({ token: data.token, role: data.user.role });

        } catch (error: any) {
            setMensaje("Usuario o contraseña incorrectos");
            toast.error(error.message);
            reset();
            setTimeout(() => setFocus("username"), 100);
        }
    };

    if (userData) {
        if (userData.role === "customer") {
            return <CustomerDashboard />;
        } else if (userData.role === "admin") {
            return <AdminTable />;
        } else {
            return <p>Rol desconocido.</p>;
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h1 className={styles.welcomeTitle}>¡Bienvenido!</h1>
                <p className={styles.welcomeText}>Inicia sesión para seguir monitoreando los dispositivos</p>
            </div>

            <div className={styles.rightPanel}>
                <img src="../images/one.png" alt="Logo" className={styles.logo} />
                <h2 className={styles.d}>Inicio de Sesión</h2>

                {/*
                // version real (to fix))
                
                {/* 
                <form className={styles.formContainer} onSubmit={handleSubmit(login)} >
                    <label className={styles.label}>E-mail:</label>
                    <input type="text" placeholder="Correo electrónico" {...register("username")} className={styles.input} />
                    <label className={styles.label}>Password:</label>
                    <input type="password" placeholder="Contraseña" {...register("password")} className={styles.input} />
                    <a href="/register" className={styles.loginLink}>¿No tienes cuenta? Regístrate</a>
                    <button type="submit" className={styles.loginButton}>Iniciar Sesión</button>
                    {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
                </form>
                */}

                <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
                    <label className={styles.label}>E-mail:</label>
                    <input type="text" placeholder="Correo electrónico" {...register("username")} className={styles.input} />
                    <label className={styles.label}>Password:</label>
                    <input type="password" placeholder="Contraseña" {...register("password")} className={styles.input} />
                    <a href="/register" className={styles.loginLink}>¿No tienes cuenta? Regístrate</a>
                    <button type="button" className={styles.loginButton} onClick={() => setUserData({ token: "dummyToken", role: "customer" })}>
                        Iniciar Sesión
                    </button>
                    {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
                </form>   
            </div>
        </div>
    );
}


function CustomerDashboard() {
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
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.registerPanel}>
            Registrar Panel <Plus size={16} />
          </button>
          <ul className={styles.locationList}>
            {["San Juan del Río", "Sonora", "Tequisquiapan", "Amealco"].map((place) => (
              <li key={place} className={styles.locationItem}>
                <BatteryCharging size={16} /> {place}
              </li>
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
              <span>Ulises Acosta</span>
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




