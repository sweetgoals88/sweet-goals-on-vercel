"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { JSX, useMemo, useState } from "react";
import Link from "next/link";
import styles from "./styles.module.css";
import { AdminRegistrationInput, AdminRegistrationInputFragment } from "../api/db/entities/user/admin/input";
import { CustomerRegistrationInput, CustomerRegistrationInputFragment } from "../api/db/entities/user/customer/input";
import { _UserRegistrationInput } from "../api/db/entities/user/_user/input";
import { CustomerLabel } from "../api/db/entities/user/customer/entity";
import { AdminLabel } from "../api/db/entities/user/admin/entity";
import CustomerPanelSpecsFormFragment from "./customer-form-fragments/panel-specs-form-fragment";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import SelectInputComponent from "@/components/inputs/select-input-component/select-input-component";
import AdminFormFragment from "./admin-form-fragments/admin-form-fragment";
import UserCustomizationFormFragment from "./customer-form-fragments/user-customization-form-fragment";
import PanelSpecsFormFragment from "./customer-form-fragments/panel-specs-form-fragment";
import VerificationCodeFormFragment from "./customer-form-fragments/verification-code-form-fragment";
import UserFormFragment from "./user-form-fragment";
import FormFragmentWrapper from "./form-fragment-wrapper";
import { FormFragmentProps } from "./form-fragment-props";

export function SignupForm() {
    const [ userType, setUserType ] = useState<CustomerLabel | AdminLabel | null>(null);
    const [ formStatus, setFormStatus ] = useState(0);
    const [ formIndex, setFormIndex ] = useState(0);

    const [ formData, setFormData ] = useState<object[]>([]);

    const customerFragments = [ VerificationCodeFormFragment, PanelSpecsFormFragment, UserCustomizationFormFragment ];
    const adminFragments = [ AdminFormFragment ];

    const fragments: ((props: FormFragmentProps<any>) => JSX.Element)[] = useMemo(() => {
        if (userType === null) return [];

        const selectedPath = userType === "customer"? customerFragments: adminFragments;
        return selectedPath.slice(0, formStatus + 1);
    }, [ userType ]);

    const saveFragmentData = (data: object) => {
        setFormData(previous => {
            const newData = [...previous];
            newData[formIndex] = data;
            return newData;
        });
    }
    const goBack = () => setFormIndex(previous => Math.max(0, previous - 1));
    const goNext = (data: object) => {
        if (formIndex === fragments.length - 1) {
            saveFragmentData(data);
            // submit form
            return;
        }

        if (formIndex === 0) {
            const userType = (data as CustomerRegistrationInputFragment | AdminRegistrationInputFragment).type;
            setUserType(userType);
        }

        saveFragmentData(data);

        if (formIndex === formStatus) {
            setFormStatus((previous) => previous + 1);
        }

        setFormIndex((previous) => previous + 1);
    };

    return (
        <div className="relative">
            <div className="absolute w-full h-full top-0" style={{ left: `${- formIndex * 100}%` }}>
                <FormFragmentWrapper
                    goBack={goBack}
                    onSuccess={goNext}
                    onError={() => {}}
                    isLast={fragments.length === 0}
                    position={0}
                    inputs={
                        (props: FormFragmentProps<_UserRegistrationInput & { type: CustomerLabel | AdminLabel }>) => 
                            UserFormFragment({ 
                                ...props, 
                                onUserTypeChange: (userType) => setUserType(userType),
                                userType
                            }
                        )
                    }
                    />
                {
                    fragments.map((fragment, index) => (
                        <FormFragmentWrapper
                            goBack={goBack}
                            onSuccess={goNext}
                            onError={() => {}}
                            isLast={index + 1 === fragments.length}
                            position={index + 1}
                            key={index}
                            inputs={fragment}
                            />
                    ))
                }
            </div>
        </div>
    );
}

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

            const respuesta = await fetch(`${process.env.API_ENDPOINT}/user/register`, {
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
        <div>
            <h1>
                Registrarse
            </h1>
            <SignupForm />
        </div>
    );
}
