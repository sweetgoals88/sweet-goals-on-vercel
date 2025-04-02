import { addDoc, arrayUnion, getDocsFromServer, query, updateDoc, where } from "firebase/firestore";
import { PanelSpecifications, PrototypeEntity } from "./prototype-entity";
import { FirebaseConfiguration } from "../firebase-configuration";
import { ApiResponseError } from "../../lib/api-response-error";
import { parseEntity } from "../parse-entity";
import { encryptString } from "../../lib/encryption";
import crypto from "crypto";

export type CustomerLabel = "customer";
export type AdminLabel = "admin";

export type _UserRegistrationInput = {
    name: string,
    surname: string,
    email: string,
    password: string,
};

export type AdminRegistrationInput = _UserRegistrationInput & {
    type: AdminLabel,
    adminEmail: string,
    adminCode: string,
};

export type CustomerRegistrationInput = _UserRegistrationInput & {
    type: CustomerLabel,
    activation_code: string,
    user_customization: {
        latitude: number,
        longitude: number, 
        label: string, 
        icon: string,
    },
    panel_specifications: PanelSpecifications
};

export type UserRegistrationInput = AdminRegistrationInput | CustomerRegistrationInput;

export type _UserEntity = {
    _id?: string,
    name: string,
    surname: string,
    email: string,
    encrypted_password: string,
};

export type CustomerEntity = _UserEntity & {
    type: CustomerLabel,
    prototypes: string[]
};

export type AdminEntity = _UserEntity & {
    type: AdminLabel,
    admin_code: string,
    invited_admins: string[],
};

export type UserEntity = CustomerEntity | AdminEntity;

export async function getUnactivePrototype(activationCode: string) {
    try {
        const prototypeQuery = query(FirebaseConfiguration.PROTOTYPE, where("activation_code", "==", activationCode));
        const prototypes = await getDocsFromServer(prototypeQuery);
        if (prototypes.empty) {
            throw new ApiResponseError(`The activation code provided doesn't exist (${activationCode})`, 400);
        }
        
        if (prototypes.size > 1) {
            throw new ApiResponseError(`Activation codes are duplicated in the database`, 500);
        }
    
        const device = parseEntity<PrototypeEntity>(prototypes.docs[0]);
        if (device.active) {
            throw new ApiResponseError(`The activation code provided has already been used (${activationCode})`, 400);
        }
    
        return prototypes.docs[0].ref;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't get the unactive prototype requested", error, 500);
    }
}

export async function validateUniqueEmail(email: string) {
    const userQuery = query(FirebaseConfiguration.USER, where("email", "==", email));
    const users = await getDocsFromServer(userQuery);
    if (!users.empty) {
        throw new ApiResponseError(`The email provided has already been used ${email}`, 400);
    }    
}

export async function signupCustomer(input: CustomerRegistrationInput) {
    try {
        // validate customer and prototype stuff
        const prototypeRef = await getUnactivePrototype(input.activation_code);
        await validateUniqueEmail(input.email);
    
        const encryptedPassword = await encryptString(input.password);
    
        const customerPayload: CustomerEntity = {
            name: input.name,
            surname: input.surname,
            email: input.email,
            prototypes: [ prototypeRef.id ],
            type: "customer",
            encrypted_password: encryptedPassword
        };
    
        await addDoc(FirebaseConfiguration.USER, customerPayload);
        await updateDoc(prototypeRef, {
            active: true,
            panel_specifications: { ...input.panel_specifications },
            user_customization: { ...input.user_customization }
        });
    } catch (error) {
        throw ApiResponseError.aggregateWith("Customer signup wasn't possible", error, 500);
    }
}

export async function validateAuthorizingAdmin(email: string, adminCode: string) {
    try {
        const adminQuery = query(
            FirebaseConfiguration.USER, 
            where("email", "==", email), 
            where("type", "==", "admin")
        );
        const admins = await getDocsFromServer(adminQuery);
    
        if (admins.empty) {
            throw new ApiResponseError(`There is not admin with the given email (${email})`, 400);
        }
        
        const admin = parseEntity<AdminEntity>(admins.docs[0]);
        if (admin.admin_code !== adminCode) {
            throw new ApiResponseError(`The code provided (${adminCode}) doesn't match the admin's`, 400);
        }

        return admins.docs[0].ref;
    } catch (error) {
        throw ApiResponseError.aggregateWith("Couldn't validate the authorizing admin", error, 500);
    }
}

export async function signupAdmin(input: AdminRegistrationInput) {
    try {
        // validate admin stuff
        const authorizingAdmin = await validateAuthorizingAdmin(input.adminEmail, input.adminCode);
        await validateUniqueEmail(input.email);

        console.log("Hello world!");
    
        const encryptedPassword = await encryptString(input.password);
    
        const adminPayload: AdminEntity = {
            admin_code: crypto.randomBytes(8).toString("hex"),
            email: input.email,
            encrypted_password: encryptedPassword,
            name: input.name,
            surname: input.surname,
            invited_admins: [],
            type: "admin"
        };
    
        const admin = await addDoc(FirebaseConfiguration.USER, adminPayload);
        await updateDoc(authorizingAdmin, {
            invited_admins: arrayUnion(admin.id)
        });
    } catch (error) {
        throw ApiResponseError.aggregateWith("Admin signup wasn't possible", error, 500);
    }
}
