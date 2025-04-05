import { NextApiRequest, NextApiResponse } from "next";
import { verifyJwt } from "../../lib/jwt";
import { cookies } from "next/headers";
import { CustomerEntity, UserJwtPayload } from "../../db/entities/user-entity";
import { ApiResponseError } from "../../lib/api-response-error";
import { doc, documentId, getDoc, getDocFromServer, getDocs, limit, query, where } from "firebase/firestore";
import { FirebaseConfiguration } from "../../db/firebase-configuration";
import { PrototypeEntity } from "../../db/entities/prototype-entity";
import { InternalReadingEntity } from "../../db/entities/internal-reading-entity";
import { ExternalReadingEntity } from "../../db/entities/external-reading-entity";
import { NotificationEntity } from "../../db/entities/notification-entity";
import { makeErrorResponse } from "../../lib/make-error-response";

export async function POST(request: NextApiRequest) {
  try {
    // should replace this with an authenticateUser call, but
    // i won't risk this because we have to present the 
    // prototype right now

    const token = (await cookies()).get("token");
    if (token === undefined) {
        throw new ApiResponseError("The token is not present", 401);
    }

    const jwtPayload = await verifyJwt<UserJwtPayload>(token.value);
    const _id = jwtPayload._id;

    const customerReference = doc(FirebaseConfiguration.USER, _id);
    const customerSnapshot = await getDoc(customerReference);

    if (!customerSnapshot.exists) { 
        throw new ApiResponseError("User not found", 404);
    }

    const customer = customerSnapshot.data() as CustomerEntity;

    const prototypeDocuments = await Promise.all(
        customer.prototypes.map((prototypeId) => {
            return getDoc(doc(FirebaseConfiguration.PROTOTYPE, prototypeId));
        })
    );

    const prototypes = await Promise.all(
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

        const internalReadings = internalReadingsSnapshot.docs.map((reading) => {
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

        const externalReadings = externalReadingsSnapshot.docs.map((reading) => {
          const data = reading.data() as ExternalReadingEntity;
          return {
            id: reading.id,
            dateTime: data.datetime.toDate(),
            light: data.light,
            temperature: data.temperature,
            current: data.current,
            voltage: data.voltage,
            wattage: data.wattage,
            panel_specifications: data.panel_specifications,
          };
        });

        const oldestInternalReading = internalReadings.length
          ? internalReadings.reduce((a, b) => a.dateTime < b.dateTime ? a : b).id
          : null;

        const oldestExternalReading = externalReadings.length
          ? externalReadings.reduce((a, b) => a.dateTime < b.dateTime ? a : b).id
          : null;

        return {
          id: prototypeDocument.id,
          operational: prototype.operational,
          version_id: prototype.version_id,
          user_customization: prototype.user_customization,
          panel_specifications: prototype.panel_specifications,
          internalReadings,
          externalReadings,
          oldestInternalReading,
          oldestExternalReading,
        };
      })
    );

    const notificationQuery = query(
      FirebaseConfiguration.NOTIFICATION,
      where("user_id", "==", _id),
      limit(20)
    );
    const notificationSnapshot = await getDocs(notificationQuery);

    const notifications = notificationSnapshot.docs.map((document) => {
      const notification = document.data() as NotificationEntity;
      return {
        id: document.id,
        type: notification.type,
        message: notification.message,
        seen: !!notification.seen_at,
        createdAt: notification.created_at.toDate(),
      };
    });

    const oldestNotification = notifications.length
      ? notifications.reduce((a, b) => a.createdAt < b.createdAt ? a : b).id
      : null;

    const payload = {
      id: _id,
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      type: customer.type,
      notifications,
      oldestNotification,
      prototypes: prototypes.filter((prototype) => prototype !== null),
    };

    return Response.json(payload, { status: 200 });
  } catch (error) {
    return makeErrorResponse("Couldn't get the dashboard data", 500, error);
  }
}
