"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css"; // Importa tu archivo CSS

export default function AuthPage() {
    const router = useRouter();
    const [mensaje, setMensaje] = useState("");
    const { register, handleSubmit, reset, setFocus } = useForm<{ username: string; password: string }>();

    // 🔹 Función para manejar el login
    const login = async ({ username, password }: { username: string; password: string }) => {
        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: username, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

            localStorage.setItem("token", data.token); // Guardamos el token en el almacenamiento local

            // 🔹 Redirección según el tipo de usuario
            if (data.user.role === "customer") {
                router.push("/usuario");
            } else if (data.user.role === "admin") {
                router.push("/admin");
            } else {
                throw new Error("Tipo de usuario desconocido");
            }

        } catch (error: any) {
            setMensaje("Usuario o contraseña incorrectos");
            toast.error(error.message);
            reset();
            setTimeout(() => setFocus("username"), 100);
        }
    };

    return (
        <div className={styles.container}>
            {/* Sección izquierda */}
            <div className={styles.leftPanel}>
                <h1 className={styles.welcomeTitle}>¡Bienvenido!</h1>
                <p className={styles.welcomeText}>Inicia sesión para seguir monitoreando los dispositivos</p>
            </div>

            {/* Sección derecha */}
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
