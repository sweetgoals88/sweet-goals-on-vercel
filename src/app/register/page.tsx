"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { _UserRegistrationInput } from "../api/db/entities/user/_user/input";
import { AdminLabel } from "../api/db/entities/user/admin/entity";
import { AdminRegistrationInput } from "../api/db/entities/user/admin/input";
import { CustomerLabel } from "../api/db/entities/user/customer/entity";
import { CustomerRegistrationInput } from "../api/db/entities/user/customer/input";
import SignupForm from "./signup-form/signup-form";
import apiCall from "@/utils/api-call";
import { API_ENDPOINTS } from "../api/endpoints";

export default function Registro() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<_UserRegistrationInput & { type: CustomerLabel | AdminLabel }>();
    const router = useRouter();
    const [mensajeError, setMensajeError] = useState("");
    const [loading, setLoading] = useState(false);
    const userType = watch("type");

    const onSubmit = async (data: CustomerRegistrationInput | AdminRegistrationInput) => {
        try {
            setLoading(true);

            const payload: any = {
                name: data.name,
                surname: data.surname,
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

            const respuesta = await apiCall<Response>(API_ENDPOINTS.USER.REGISTER, payload);
            // const respuesta = await fetch(`${process.env.API_ENDPOINT}/user/register`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            // });

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
        <div>
            <h1>
                Registrarse
            </h1>
            <SignupForm />
        </div>
    );
}
