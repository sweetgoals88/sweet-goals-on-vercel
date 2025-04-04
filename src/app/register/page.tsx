"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

// Definir el tipo de los datos del formulario
interface RegistroFormData {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    type: "customer" | "admin";
    activation_code?: string;
    user_customization?: {
        latitude: number;
        longitude: number;
        label: string;
        icon: string;
    };
    panel_specifications?: any;
    adminEmail?: string;
    adminCode?: string;
}

export default function Registro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<RegistroFormData>();
    const router = useRouter();
    const [mensajeError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(false);
    const userType = watch("type");

    const onSubmit = async (data: RegistroFormData) => {
        try {
            setLoading(true);

            const payload: any = {
                name: data.nombre,
                surname: data.apellido,
                email: data.email,
                password: data.password,
                type: data.type,
            };

            if (data.type === "customer") {
                payload.activation_code = data.activation_code;
                payload.user_customization = {
                    latitude: 0, 
                    longitude: 0, 
                    label: "default", 
                    icon: "default"
                };
                payload.panel_specifications = {};
            } else {
                payload.adminEmail = data.adminEmail;
                payload.adminCode = data.adminCode;
            }

            const respuesta = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.error || "Error desconocido al registrar usuario");
            }

            router.push("/login");

        } catch (error: any) {
            setMensajeError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            
           <div>
                <img src="/images/register.png" alt="Logo" className={styles.logo} />
                <h1 className={styles.d}>Regístrate</h1>
           </div>

            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>

                <p>Nombre:</p>
                <input
                    type="text"
                    placeholder="Nombre"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className={styles.input}
                />
                {errors.nombre && <p className={styles.error}>{errors.nombre.message}</p>}

                <p>Apellido:</p>
                <input
                    type="text"
                    placeholder="Apellido"
                    {...register("apellido", { required: "El apellido es obligatorio" })}
                    className={styles.input}
                />
                {errors.apellido && <p className={styles.error}>{errors.apellido.message}</p>}

                <p>Correo:</p>
                <input
                    type="email"
                    placeholder="Correo"
                    {...register("email", {
                        required: "El correo es obligatorio",
                        pattern: { value: /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/, message: "Correo inválido" }
                    })}
                    className={styles.input}
                />
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}

                <p>Contraseña:</p>
                <input
                    type="password"
                    placeholder="Contraseña"
                    {...register("password", { required: "La contraseña es obligatoria", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                    className={styles.input}
                />
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}

                <p>Tipo de usuario:</p>
                <select {...register("type", { required: "Selecciona un tipo de usuario" })} className={styles.input}>
                    <option value="">Selecciona...</option>
                    <option value="customer">Cliente</option>
                    <option value="admin">Administrador</option>
                </select>
                {errors.type && <p className={styles.error}>{errors.type.message}</p>}

                {/* Campos adicionales según el tipo de usuario */}
                {userType === "customer" && (
                    <>
                        <p>Código de Activación:</p>
                        <input
                            type="text"
                            placeholder="Código de activación"
                            {...register("activation_code", { required: "El código de activación es obligatorio" })}
                            className={styles.input}
                        />
                        {errors.activation_code && <p className={styles.error}>{errors.activation_code.message}</p>}
                    </>
                )}

                {userType === "admin" && (
                    <>
                        <p>Correo del Administrador Autorizante:</p>
                        <input
                            type="email"
                            placeholder="Correo del administrador"
                            {...register("adminEmail", { required: "Este campo es obligatorio" })}
                            className={styles.input}
                        />
                        {errors.adminEmail && <p className={styles.error}>{errors.adminEmail.message}</p>}

                        <p>Código del Administrador:</p>
                        <input
                            type="text"
                            placeholder="Código de administrador"
                            {...register("adminCode", { required: "Este campo es obligatorio" })}
                            className={styles.input}
                        />
                        {errors.adminCode && <p className={styles.error}>{errors.adminCode.message}</p>}
                    </>
                )}

                {mensajeError && <p className={styles.error}>{mensajeError}</p>}

                <Link href="/login" className={styles.loginLink}>&lt;- Regresar</Link>

                <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? "Registrando..." : "Registrar usuario"}
                </button>
            </form>
        </div>
    );
}
