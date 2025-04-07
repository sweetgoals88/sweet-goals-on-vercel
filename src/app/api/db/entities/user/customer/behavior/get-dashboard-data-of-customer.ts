import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { getNotificationsOfUser } from "../../behavior/get-notifications-of-user";
import { CustomerEntity } from "../entity";
import { CustomerPreview } from "../preview";
import { getPrototypesOfCustomer } from "./get-prototypes-of-customer";

export async function getDashboardDataOfCustomer(
  user: CustomerEntity,
  id: string
) {
  try {
    const [prototypes, notificationsData] = await Promise.all([
      getPrototypesOfCustomer(user, id),
      getNotificationsOfUser(id),
    ]);

    const [notifications, oldestNotification] = notificationsData;

    const payload: CustomerPreview = {
      id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      type: user.type,
      notifications,
      oldestNotification,
      prototypes: prototypes.filter((prototype) => prototype !== null),
    };

    return payload;
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Couldn't get the user's dashboard data",
      error,
      500
    );
  }
}
