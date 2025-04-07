import {
  doc,
  documentId,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AdminEntity } from "../entity";
import { AdminPreview } from "../preview";
import { FirebaseConfiguration } from "@/app/api/db/firebase-configuration";
import { AdminEntry } from "../entry";
import { CustomerEntry } from "../../customer/entry";
import { CustomerEntity } from "../../customer/entity";
import { PrototypeEntity } from "../../../prototype/entity";
import { PrototypeEntry } from "../../../prototype/entry";
import { ApiResponseError } from "@/app/api/lib/api-response-error";
import { UserEntity } from "../../entity";

export async function getAdminAsEntry(adminId: string): Promise<AdminEntry> {
  const reference = doc(FirebaseConfiguration.USER, adminId);
  const document = await getDoc(reference);
  const data = document.data() as AdminEntity;

  return {
    id: adminId,
    adminCode: data.admin_code,
    email: data.email,
    name: data.name,
    surname: data.surname,
    permissions: data.permissions,
  };
}

export async function getAdminEntriesOfAdmin(
  admin: AdminEntity
): Promise<AdminEntry[]> {
  if (admin.invited_admins === undefined || admin.invited_admins.length == 0) {
    return [];
  }
  return Promise.all(admin.invited_admins.map(getAdminAsEntry));
}

export function convertCustomerToEntry(
  customer: CustomerEntity,
  id: string
): CustomerEntry {
  return {
    email: customer.email,
    id,
    name: customer.name,
    surname: customer.surname,
  };
}

export async function getCustomerEntriesOfAdmin(): Promise<CustomerEntry[]> {
  const customersQuery = query(FirebaseConfiguration.USER, limit(20), orderBy(documentId()));
  const customersSnapshot = await getDocs(customersQuery);
  const customerEntries = customersSnapshot.docs.map((document) =>
    convertCustomerToEntry(document.data() as CustomerEntity, document.id)
  );
  return customerEntries;
}

export async function getPrototypeAsEntry(
  prototype: PrototypeEntity,
  id: string
): Promise<PrototypeEntry> {
  const userReference = query(
    FirebaseConfiguration.USER,
    where(id, "in", "prototypes")
  );
  const userSnapshot = await getDocs(userReference);
  if (userSnapshot.docs.length > 1) {
    throw new ApiResponseError("The prototype has more than one owner", 500);
  }

  let owner;
  if (userSnapshot.empty) {
    owner = null;
  } else {
    const reference = userSnapshot.docs[0];
    const user = reference.data() as UserEntity;
    owner = {
      id: reference.id,
      name: user.name,
      surname: user.surname,
    };
  }

  return {
    activationCode: prototype.activation_code,
    id,
    key: prototype.key,
    operational: prototype.operational,
    owner,
    version: prototype.version_id,
  };
}

export async function getPrototypeEntriesOfAdmin() {
  const prototypesQuery = query(FirebaseConfiguration.PROTOTYPE, limit(20), orderBy(documentId()));
  const prototypesSnapshot = await getDocs(prototypesQuery);
  return Promise.all(
    prototypesSnapshot.docs.map((document) =>
      getPrototypeAsEntry(document.data() as PrototypeEntity, document.id)
    )
  );
}

export async function getDashboardDataOfAdmin(
  admin: AdminEntity,
  id: string
): Promise<AdminPreview> {
  // const data =
  const [ adminEntries, customerEntries, prototypeEntries ] = await Promise.all([
    getAdminEntriesOfAdmin(admin),
    getCustomerEntriesOfAdmin(),
    getPrototypeEntriesOfAdmin()
  ]);

  return {
    adminCode: admin.admin_code,
    admins: adminEntries,
    customers: customerEntries,
    email: admin.email,
    id,
    lastCustomer: customerEntries[customerEntries.length - 1].id,
    lastPrototype: prototypeEntries[prototypeEntries.length - 1].id,
    name: admin.name,
    permissions: admin.permissions,
    prototypes: prototypeEntries,
    surname: admin.surname,
    type: admin.type
  };
}
