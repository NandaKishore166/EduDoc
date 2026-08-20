import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface DocumentData {
  id?: string;
  projectId: string;
  type: string;
  content: string;
  createdAt?: any;
}

export const saveDocument = async (
  projectId: string,
  type: string,
  content: string
) => {
  await addDoc(collection(db, "documents"), {
    projectId,
    type,
    content,
    createdAt: serverTimestamp(),
  });
};

export const getProjectDocuments = async (projectId: string) => {
  const q = query(
    collection(db, "documents"),
    where("projectId", "==", projectId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as DocumentData),
  }));
};