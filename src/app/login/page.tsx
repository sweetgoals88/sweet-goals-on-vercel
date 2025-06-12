"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

import React from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import { useRouter } from "next/navigation";
import apiCall from "@/utils/api-call";

export default function LoginPage() {
    const [mensaje, setMensaje] = useState("");
    const { register, handleSubmit, reset, setFocus } = useForm<{ username: string; password: string }>();
    const router = useRouter();

    const login = async ({ username, password }: { username: string; password: string }) => {
        try {
          const response = await apiCall(
            API_ENDPOINTS.USER.LOGIN,
            { email: username, password }
          );

            // const response = await fetch(API_ENDPOINTS.USER.LOGIN, {
            //   method: "POST",
            //   headers: { "Content-Type": "text/plain" },
            //   body: JSON.stringify({ email: username, password }),
            //   credentials: "include",
            // });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");
            router.push("/dashboard");
        } catch (error: any) {
          setMensaje("Usuario o contraseña incorrectos");
          toast.error(error.message);
          reset();
          setTimeout(() => setFocus("username"), 100);
        }
    };

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
                    <input 
                      type="text" 
                      placeholder="Correo electrónico" 
                      {
                        ...register(
                          "username", 
                          { 
                            required: true, 
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Formato de correo inválido"
                            }
                          }
                        )
                      } 
                      className={styles.input} 
                    />
                    <label className={styles.label}>Password:</label>
                    <input type="password" placeholder="Contraseña" {...register("password")} className={styles.input} />
                    <a href="/register" className={styles.loginLink}>¿No tienes cuenta? Regístrate</a>
                    <button type="submit" className={styles.loginButton}>
                        Iniciar Sesión
                    </button>
                    {mensaje && <p className={styles.errorMessage}>{mensaje}</p>}
                </form>   
            </div>
        </div>
    );
}
