"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";

// Definir el tipo de los datos del formulario
interface RegistroFormData {
    nombre: string;
    email: string;
    password: string;
}

export default function Registro() {
    const { register, handleSubmit, formState: { errors } } = useForm<RegistroFormData>();
    const router = useRouter();
    const [mensajeError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(false);

    // Especificar el tipo de `data`
    const onSubmit = async (data: RegistroFormData) => {
        try {
            setLoading(true);

            const respuesta = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
            <img src="/images/register.png" alt="Logo" className={styles.logo} />
            <h1 className={styles.d}>Regístrate</h1>

            <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>

                <p>Nombre:</p>
                <input
                    type="text"
                    placeholder="Nombre Completo"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className={styles.input}
                />
                {errors.nombre && <p className={styles.error}>{errors.nombre.message}</p>}

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

                {mensajeError && <p className={styles.error}>{mensajeError}</p>}

                <Link href="/login" className={styles.loginLink}>&lt;- Regresar</Link>

                <button type="submit" className={styles.loginButton} disabled={loading}>
                    {loading ? "Registrando..." : "Registrar usuario"}
                </button>
            </form>
        </div>
    );
}
