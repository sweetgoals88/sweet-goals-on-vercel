'use client';

import apiCall from "@/utils/api-call";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import { UserProfileView } from "../api/db/entities/user/profile-view";
import LoadingScreen from "../dashboard/loading-screen/loading-screen";
import RegularInputComponent from "@/components/inputs/regular-input-component/regular-input-component";
import { useForm } from "react-hook-form";
import DashboardHeader from "@/components/dashboard-header/dashboard-header";
import styles from "./styles.module.css";
import ProfileForm from "./profile-form/profile-form";

export default function ProfilePage() {
      const [originalUserData, setOriginalUserData] = useState<UserProfileView | null>(null);
      const [clientUserData, setClientUserData ] = useState<UserProfileView | null>(null);
      const [loading, setLoading] = useState(true);

      const isDataEdited = useMemo(() => {
        if (!originalUserData || !clientUserData) return false;
        if (
            originalUserData.email !== clientUserData.email ||
            originalUserData.name !== clientUserData.name ||
            originalUserData.surname !== clientUserData.surname
        ) {
            return false;
        }
        if (originalUserData.type === "admin" && clientUserData.type === "admin") {
          if (
            originalUserData.admin_code !== clientUserData.admin_code ||
            originalUserData.permissions !== clientUserData.permissions
          ) {
            return false;
          }
        } else {
          // additional checks for the customer profile view; non existing at the
          // time of writing
        }
        return true;
      }, [ originalUserData, clientUserData ]);

      const { formState: { errors }, handleSubmit, register } = useForm<UserProfileView>();

      const router = useRouter();

      useEffect(() => {
        const fetchData = async () =>
          apiCall(API_ENDPOINTS.USER.GET_PROFILE_DATA)
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                // @todo I'm assuming the JSON data conforms with the structure
                // defined in the API, but I should validate it anyway
                setOriginalUserData(json);
                setClientUserData(json);

                console.log("The user data is: ");
                console.log(json);
            })
            .catch((error) => {
                // @todo Should show the error to the user somehow
              router.push("/login");
            });
        fetchData();
      }, []);
    
    return (
      <div>
        { 
          loading && (
            <LoadingScreen />
          ) 
        }
        <div className={styles["profile-page__container"]}>
          <DashboardHeader data={{
            name: originalUserData?.name || "",
            surname: originalUserData?.surname || "",
            type: originalUserData?.type || "customer",
          }}
          className={styles["profile-page__header"]}
          />

          <ProfileForm 
            className={styles["profile-page__form"]}
            clientUserData={clientUserData}
            setClientUserData={setClientUserData}
            errors={errors}
            register={register}
            handleSubmit={handleSubmit}
            isDataEdited={isDataEdited}
            />
        </div>
      </div>
    );
}
