"use client";

import { _UserRegistrationInput } from "../api/db/entities/user/_user/input";
import { AdminRegistrationInput } from "../api/db/entities/user/admin/input";
import { CustomerRegistrationInput } from "../api/db/entities/user/customer/input";
import SignupForm from "./signup-form/signup-form";
import apiCall from "@/utils/api-call";
import { API_ENDPOINTS } from "../api/endpoints";
import ShortNavbarComponent from "@/components/short-navbar-component/short-navbar-component";

export default function Registro() {
    const registerData = async (data: CustomerRegistrationInput | AdminRegistrationInput) => {
        try {
            await apiCall(API_ENDPOINTS.USER.REGISTER, data);
            return console.log("User signed up succesfully");
        } catch {
            return console.log("Error logging in user");
        }
    };

    return (
        <div>
            <ShortNavbarComponent />
            <h1>
                Registrarse
            </h1>
            <SignupForm 
                onSubmit={registerData}
                />
        </div>
    );
}
