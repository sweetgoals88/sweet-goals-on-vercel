"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

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
                <form className={styles.formContainer} onSubmit={handleSubmit(login)}>
                    <label className={styles.label}>E-mail:</label>
                    <input type="text" placeholder="Correo electrónico" {...register("username")} className={styles.input} />
                    <label className={styles.label}>Password:</label>
                    <input type="password" placeholder="Contraseña" {...register("password")} className={styles.input} />
                    <a href="/register" className={styles.loginLink}>¿No tienes cuenta? Regístrate</a>
                    <button type="submit" className={styles.loginButton}>Iniciar Sesión</button>
                    {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
                </form>
            </div>
        </div>
    );
}

function CustomerDashboard() {
    return <h1 style={{ textAlign: "center", marginTop: "2rem" }}>Bienvenido al Dashboard del Usuario</h1>;
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
