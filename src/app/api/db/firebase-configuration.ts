import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export class FirebaseConfiguration {
    
    static firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };
    
    static app = initializeApp(FirebaseConfiguration.firebaseConfig);
    static db = getFirestore(FirebaseConfiguration.app);
    static auth = getAuth(FirebaseConfiguration.app);
    
    static getCollection(name: string) {
        return collection(FirebaseConfiguration.db, name);
    }

    static PROTOTYPE = FirebaseConfiguration.getCollection("Prototype");
    static INTERNAL_READING = FirebaseConfiguration.getCollection("InternalReading");
    static EXTERNAL_READING = FirebaseConfiguration.getCollection("ExternalReading");
    static VERSION = FirebaseConfiguration.getCollection("Version");
    static USER = FirebaseConfiguration.getCollection("User");
};


export const db = FirebaseConfiguration.db;
export const auth = FirebaseConfiguration.auth;
export const app = FirebaseConfiguration.app;