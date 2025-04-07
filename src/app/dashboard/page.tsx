'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,  XAxis, YAxis, Tooltip, Legend, LabelList } from "recharts";

import { Home, Plus, Bell, User, HelpCircle, Sun, BatteryCharging } from "lucide-react";
import { FaApple, FaGooglePlay } from "react-icons/fa";

import styles from "./styles.module.css";
import { API_ENDPOINTS } from "../api/endpoints";
import { CustomerPreview, getCustomerPreviewFromJson, UserPreview } from "../api/db/previews/user-preview";
import PrototypeListElement from "@/components/prototype-list-element/prototype-list-element";
import LoadingScreen from "./loading-screen/loading-screen";
import { CustomerDashboard } from "./customer-dashboard/customer-dashboard";
import {AdminDashboard} from "./admin-dasboard/page";

export default function DashboardPage() {
    const [userData, setUserData] = useState<UserPreview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.USER.GET_DASHBOARD_DATA, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const json = await response.json();
                console.log(json);

                if (json.type === "customer") {
                    const data = getCustomerPreviewFromJson(json);
                    setUserData(data);
                } else {
                    setUserData({ type: "admin" } as UserPreview); 
                }
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <LoadingScreen />
        );
    };

    if (userData?.type === "customer") {
        return (
            <CustomerDashboard 
                data={userData} 
                setUserData={setUserData as Dispatch<SetStateAction<CustomerPreview>>}
                />
        );
    }
    if (userData?.type === "admin") {
        return (
            <AdminDashboard />
        );
    }
    return <p>Rol desconocido.</p>;
}
  

  function AdminTable() {
    // Esto se puede conectar luego a una API para obtener usuarios
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Vista de Administrador</h1>
            <table border={1} cellPadding="10" style={{ marginTop: "1rem" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Usuario de ejemplo</td>
                        <td>correo@ejemplo.com</td>
                    </tr>
                    {/* Aquí puedes mapear una lista real más adelante */}
                </tbody>
            </table>
        </div>
    );
}