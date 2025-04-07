"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import LoadingScreen from "./loading-screen/loading-screen";
import { CustomerDashboard } from "./customer-dashboard/customer-dashboard";
import { AdminDashboard } from "./admin-dasboard/admin-dashboard";
import { CustomerPreview } from "../api/db/entities/user/customer/preview";
import {
  UserPreview,
  getCustomerPreviewFromJson,
} from "../api/db/entities/user/preview";
import { AdminPreview } from "../api/db/entities/user/admin/preview";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserPreview | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () =>
      fetch(API_ENDPOINTS.USER.IS_LOGGED_IN, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "text/plain",
        },
      })
        .then(() =>
          fetch(API_ENDPOINTS.USER.GET_DASHBOARD_DATA, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "text/plain",
            },
          })
        )
        .then((response) => response.json())
        .then((json) => {
          if (json.type === "customer") {
            const data = getCustomerPreviewFromJson(json);
            setLoading(false);
            setUserData(data);
        } else if (json.type === "admin") {
            setLoading(false);
            setUserData(json as AdminPreview);
          } else {
            throw new Error("Something went wrong with the server");
          }
        })
        .catch((error) => {
          router.push("/login");
        });
    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (userData?.type === "customer") {
    return (
      <CustomerDashboard
        data={userData}
        setUserData={setUserData as Dispatch<SetStateAction<CustomerPreview>>}
      />
    );
  }
  if (userData?.type === "admin") {
    return <AdminDashboard data={userData} />;
  }
  return <p>Rol desconocido.</p>;
}
