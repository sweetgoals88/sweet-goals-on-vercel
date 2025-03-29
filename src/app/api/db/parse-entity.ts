import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export function parseEntity<K>(object: QueryDocumentSnapshot<DocumentData, DocumentData>): K {
    return { _id: object.id, ...object.data() } as K;
}
