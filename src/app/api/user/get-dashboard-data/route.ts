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
import { reverseGeocoding } from "../../lib/geocoding";
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

async function getPrototypeInternalReadings(prototype: PrototypeEntity): Promise<[InternalReadingPreview[], string | null]> {
  try {
    if (prototype.internal_readings === undefined || prototype.internal_readings.length === 0) {
      return [ [], null ];
    }
  
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
    
    const oldestInternalReading = internalReadings.length
    ? internalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
        .id
    : null;
    
    return [ internalReadings, oldestInternalReading ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the prototype's internal readings", error, 500);
  }
}

async function getPrototypeExternalReadings(prototype: PrototypeEntity): Promise<[ExternalReadingPreview[], string | null]> {
  try {
    if (prototype.external_readings === undefined || prototype.external_readings.length === 0) {
      return [ [], null ];
    }
  
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
  
    const oldestExternalReading = externalReadings.length
      ? externalReadings.reduce((a, b) => (a.dateTime < b.dateTime ? a : b))
          .id
      : null;
    
    return [ externalReadings, oldestExternalReading ]
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the prototype's external readings", error, 500);
  }
}

async function getCustomerPrototypes(customer: CustomerEntity, id: string) {
  try {
    const prototypeDocuments = await Promise.all(
      customer.prototypes.map((prototypeId) => {
        return getDoc(doc(FirebaseConfiguration.PROTOTYPE, prototypeId));
      })
    );
  
    const prototypes: PrototypePreview[] = (await Promise.all(
      prototypeDocuments.map(async (prototypeDocument) => {
        const prototype = prototypeDocument.data() as PrototypeEntity;
        if (!prototype) return null;
  
        const [ internalReadingsData, externalReadingsData, locationNameData ] = await Promise.all([
          getPrototypeInternalReadings(prototype),
          getPrototypeExternalReadings(prototype),
          reverseGeocoding(
            prototype.user_customization.latitude, 
            prototype.user_customization.longitude
          )
        ]);
  
        const [ internalReadings, oldestInternalReading ] = internalReadingsData;
        const [ externalReadings, oldestExternalReading ]= externalReadingsData;
        const locationName = locationNameData[0].formattedAddress as string;
  
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
  
    return prototypes;
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the customer prototypes", error, 500);
  }
}

async function getUserNotifications(id: string): Promise<[NotificationPreview[], string | null]> {
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
    
    return [ notifications, oldestNotification ];
  } catch (error) {
    throw ApiResponseError.aggregateWith("Couldn't get the user's notifications", error, 500);
  }
}

async function getCustomerDashboardData(user: CustomerEntity, id: string) {
  try {
    const [prototypes, notificationsData] = await Promise.all([
      getCustomerPrototypes(user, id),
      getUserNotifications(id)
    ]);
  
    const [ notifications, oldestNotification ] = notificationsData;
  
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
    throw ApiResponseError.aggregateWith("Couldn't get the user's dashboard data", error, 500);
  }
}
