import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "../../lib/jwt";
import { cookies } from "next/headers";
import {
  CustomerEntity,
  UserEntity,
} from "../../db/entities/user-entity";
import {
  doc,
  documentId,
  getDoc,
  getDocFromServer,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { PrototypeEntity } from "../../db/entities/prototype-entity";
import { InternalReadingEntity } from "../../db/entities/internal-reading-entity";
import { ExternalReadingEntity } from "../../db/entities/external-reading-entity";
import { NotificationEntity } from "../../db/entities/notification-entity";
import { makeErrorResponse } from "../../lib/make-error-response";
import { panelSpecificationsEntityToPreview, PrototypePreview } from "../../db/previews/prototype-preview";
import { ExternalReadingPreview } from "../../db/previews/external-reading-preview";
import { InternalReadingPreview } from "../../db/previews/internal-reading-preview";
import { NotificationPreview } from "../../db/previews/notification-preview";
import { CustomerPreview } from "../../db/previews/user-preview";
import { authenticateUser } from "../../lib/authenticate-user";
import { reverseGeocoding } from "../../lib/reverse-geocoding";
import { ApiResponseError } from "../../lib/api-response-error";

export async function POST(request: NextApiRequest) {
  try {
    const userSnapshot = await authenticateUser(
      () => cookies(),
      {}
    );

    const user = userSnapshot.data() as UserEntity;
    if (user.type === "customer") {
      return Response.json(await getCustomerDashboardData(user, userSnapshot.id), { status: 200 });
    } else if (user.type === "admin") {
      return makeErrorResponse("Admin dashboard not implemented yet", 501);
    } else {
      return makeErrorResponse("User type not recognized", 400);
    }
  } catch (error) {
    return makeErrorResponse("Couldn't get the dashboard data", 500, error);
  }
}

async function getCustomerDashboardData(user: CustomerEntity, id: string) {
  const prototypeDocuments = await Promise.all(
    user.prototypes.map((prototypeId) => {
      return getDoc(doc(FirebaseConfiguration.PROTOTYPE, prototypeId));
    })
  );

  console.log("Before prototypes");


  const prototypes: PrototypePreview[] = (await Promise.all(
    prototypeDocuments.map(async (prototypeDocument) => {
      const prototype = prototypeDocument.data() as PrototypeEntity;
      if (!prototype) return null;

      const internalReadingsSnapshot = await getDocs(
        query(
          FirebaseConfiguration.INTERNAL_READING,
          where(documentId(), "in", prototype.internal_readings),
          limit(20)
        )
      );

      const internalReadings: InternalReadingPreview[] =
        internalReadingsSnapshot.docs.map((reading) => {
          const data = reading.data() as InternalReadingEntity;
          return {
            id: reading.id,
            dateTime: data.datetime.toDate(),
            humidity: data.humidity,
            temperature: data.temperature,
          };
        });

      const externalReadingsSnapshot = await getDocs(
        query(
          FirebaseConfiguration.EXTERNAL_READING,
          where(documentId(), "in", prototype.external_readings),
          limit(20)
        )
      );

      const externalReadings: ExternalReadingPreview[] =
        externalReadingsSnapshot.docs.map((reading) => {
          const data = reading.data() as ExternalReadingEntity;
          return {
            id: reading.id,
            dateTime: data.datetime.toDate(),
            light: data.light,
            temperature: data.temperature,
            current: data.current,
            voltage: data.voltage,
            wattage: data.wattage,
            panelSpecifications: panelSpecificationsEntityToPreview(data.panel_specifications),
          };
        });

      const oldestInternalReading = internalReadings.length
        ? internalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
            .id
        : null;

      const oldestExternalReading = externalReadings.length
        ? externalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
            .id
        : null;

      const locationName = (await reverseGeocoding(
        prototype.user_customization.latitude, 
        prototype.user_customization.longitude
      ))[0].formattedAddress as string;

      return {
        id: prototypeDocument.id,
        operational: prototype.operational,
        versionId: prototype.version_id,
        userCustomization: {
          ...prototype.user_customization,
          locationName
        },
        panelSpecifications: panelSpecificationsEntityToPreview(prototype.panel_specifications),
        internalReadings,
        externalReadings,
        oldestInternalReading,
        oldestExternalReading,
      };
    })
  )).filter(prototype => prototype !== null);

  console.log("Before notifications");
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
}
