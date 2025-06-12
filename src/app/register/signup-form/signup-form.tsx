"use client";

import { JSX, useMemo, useState } from "react";
import { AdminRegistrationInput, AdminRegistrationInputFragment } from "../../api/db/entities/user/admin/input";
import { CustomerRegistrationInput, CustomerRegistrationInputFragment } from "../../api/db/entities/user/customer/input";
import { _UserRegistrationInput } from "../../api/db/entities/user/_user/input";
import { CustomerLabel } from "../../api/db/entities/user/customer/entity";
import { AdminLabel } from "../../api/db/entities/user/admin/entity";
import AdminFormFragment, { AdminFormFragmentOutput } from "../admin-form-fragments/admin-form-fragment";
import UserCustomizationFormFragment, { UserCustomizationFormFragmentOutput } from "../customer-form-fragments/user-customization-form-fragment";
import PanelSpecsFormFragment, { PanelSpecsFormFragmentOutput } from "../customer-form-fragments/panel-specs-form-fragment";
import ActivationCodeFormFragment, { ActivationCodeFormFragmentOutput } from "../customer-form-fragments/activation-code-form-fragment";
import UserSubform from "../user-subform/user-subform";
import { FormFragmentProps } from "../form-fragment-props";
import styles from "./styles.module.css";
import { useForm, UseFormReturn } from "react-hook-form";
import { UserRegistrationInput } from "@/app/api/db/entities/user/entity";
import apiCall from "@/utils/api-call";
import { API_ENDPOINTS } from "@/app/api/endpoints";
import { PanelSpecificationsEntity, UserCustomizationType } from "@/app/api/db/entities/prototype/entity";

type FormFragmentTuple = [ 
    formReturn: UseFormReturn<any>, 
    formFragment: (props: FormFragmentProps<any>) => JSX.Element 
];

export type SignupFormProps = {
    onSubmit?: (data: CustomerRegistrationInput | AdminRegistrationInput) => Promise<void>;
};

export default function SignupForm(props: SignupFormProps) {
    const [ userType, setUserType ] = useState<CustomerLabel | AdminLabel | null>(null);
    const [ formStatus, setFormStatus ] = useState(0);
    const [ formIndex, setFormIndex ] = useState(0);

    const [ formData, setFormData ] = useState<object[]>([]);

    const userFragmentFormReturn = useForm<UserRegistrationInput>();

    const customerFragments: FormFragmentTuple[] = [
        [ useForm<ActivationCodeFormFragmentOutput>(), ActivationCodeFormFragment ],
        [ useForm<PanelSpecsFormFragmentOutput>(), PanelSpecsFormFragment ], 
        [ useForm<UserCustomizationFormFragmentOutput>(), UserCustomizationFormFragment ]
    ];
    const adminFragments: FormFragmentTuple[] = [ 
        [ useForm<AdminFormFragmentOutput>(), AdminFormFragment ] 
    ];

    const fragments: FormFragmentTuple[] = useMemo(() => {
        const bundle: FormFragmentTuple[] = [ ];
        if (userType === null) return bundle;

        const selectedPath = userType === "customer"? customerFragments: adminFragments;
        bundle.push(...selectedPath.slice(0, formStatus + 1));
        return bundle;
    }, [ userType, formStatus ]);

    const saveFragmentData = (data: object) => {
        setFormData(previous => {
            const newData = [...previous];
            newData[formIndex] = data;
            return newData;
        });
    }

    const isFirst = formIndex === 0;
    const isLast = formIndex === fragments.length;

    const goBack = () => {
        setFormIndex(previous => {
            const newIndex = Math.max(0, previous - 1);
            return newIndex;
        })
    };

    const validateCurrentFragment = async () => {
        const useFormReturn: UseFormReturn<any> = (() => {
            if (formIndex === 0) return userFragmentFormReturn;
            if (userType === "admin") return adminFragments[formIndex - 1][0];
            return customerFragments[formIndex - 1][0];
        })();
        return useFormReturn.trigger();
    }

    const goNext = async (data: object) => {
        if (!await validateCurrentFragment()) return;

        saveFragmentData(data);

        if (formIndex === formStatus) {
            setFormStatus((previous) => previous + 1);
        }

        setFormIndex((previous) => previous + 1);
    };

    const sendData = async () => {
        if (userType === null) return;
        if (!await validateCurrentFragment()) return;

        let data: CustomerRegistrationInput | AdminRegistrationInput;

        if (userType === "customer") {
            const userData = userFragmentFormReturn.getValues();
            const activationCode = customerFragments[0][0].getValues() as ActivationCodeFormFragmentOutput;
            const panelSpecifications = customerFragments[1][0].getValues() as PanelSpecificationsEntity;
            const userCustomization = customerFragments[2][0].getValues() as UserCustomizationType;

            data = {
                ...userData,
                activation_code: activationCode.activation_code,
                panel_specifications: panelSpecifications,
                type: userType,
                user_customization: userCustomization,
            } as CustomerRegistrationInput;
        } else {
            const userData = userFragmentFormReturn.getValues();
            const adminData = adminFragments[0][0].getValues() as AdminFormFragmentOutput;

            data = {
                ...userData,
                adminCode: adminData.adminCode,
                adminEmail: adminData.adminEmail,
                type: userType,
            } as AdminRegistrationInput;
        }

        await props.onSubmit?.(data);
    };

    return (
        <div className={styles["signup-form"]}>
            <div className={styles["signup-form__window-wrapper"]}>
                <div className={styles["signup-form__window"]} style={{ left: `${- formIndex * 100}%` }}>
                    <UserSubform 
                        errors={userFragmentFormReturn.formState.errors}
                        register={userFragmentFormReturn.register}
                        position={0}
                        userType={userType}
                        onUserTypeChange={(type) => {
                            setUserType(type);
                            setFormStatus(0);
                            setFormIndex(0);
                            setFormData([]);
                        }}
                        submitFunction={userFragmentFormReturn.handleSubmit(() => console.log("Handling this"))}
                        />
                    {
                        fragments.map(([ useFormReturn, Fragment ], index) => (
                            <Fragment 
                                errors={useFormReturn.formState.errors}
                                position={index + 1}
                                register={useFormReturn.register}
                                key={index}
                                />
                        ))
                    }
                </div>
            </div>
            <div className={styles["signup-form__button-tray"]}>
                {
                    !isFirst && (
                        <button 
                            onClick={goBack}
                            className={`${styles["signup-form__button"]} ${styles["signup-form__button--previous"]}`}
                            >
                            Regresar
                        </button>
                    )
                }
                {
                    !isLast 
                    && (
                        <button 
                            className={`${styles["signup-form__button"]} ${styles["signup-form__button--next"]}`}
                            onClick={goNext}
                            >
                            Siguiente
                        </button>
                    )
                }
                {
                    isLast && !isFirst && (
                        <button 
                            type="submit"
                            className={`${styles["signup-form__button"]} ${styles["signup-form__button--next"]}`}
                            onClick={sendData}
                            >
                            Enviar
                        </button>
                    )
                }
            </div>
        </div>
    );
}
