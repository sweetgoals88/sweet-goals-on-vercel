import { getDocs, limit, query, where } from "firebase/firestore";
import { NotificationPreview } from "../../notification/preview";
import { FirebaseConfiguration } from "../../../firebase-configuration";
import { NotificationEntity } from "../../notification/entity";
import { ApiResponseError } from "@/app/api/lib/api-response-error";

export async function getNotificationsOfUser(
  id: string
): Promise<[NotificationPreview[], string | null]> {
  try {
    const notificationQuery = query(
      FirebaseConfiguration.NOTIFICATION,
      where("user_id", "==", id),
      limit(20)
    );
    const notificationSnapshot = await getDocs(notificationQuery);

    const notifications: NotificationPreview[] = notificationSnapshot.docs.map(
      (document) => {
        const notification = document.data() as NotificationEntity;
        return {
          id: document.id,
          type: notification.type,
          message: notification.message,
          seen: !!notification.seen_at,
          createdAt: notification.created_at.toDate(),
        };
      }
    );

    const oldestNotification = notifications.length
      ? notifications.reduce((a, b) => (a.createdAt < b.createdAt ? a : b)).id
      : null;

    return [notifications, oldestNotification];
  } catch (error) {
    throw ApiResponseError.aggregateWith(
      "Couldn't get the user's notifications",
      error,
      500
    );
  }
}
