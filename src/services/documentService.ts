import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface DocumentData {
  id?: string;
  projectId: string;
  ownerId: string;
  type: string;
  content: string;
  createdAt?: any;
  updatedAt?: any;
}

// Create document
export const saveDocument = async (
  projectId: string,
  ownerId: string,
  type: string,
  content: string
) => {
  await addDoc(collection(db, "documents"), {
    projectId,
    ownerId,
    type,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

// Get documents belonging to a project
export const getProjectDocuments = async (
  projectId: string,
  ownerId: string
) => {
  const q = query(
    collection(db, "documents"),
    where("projectId", "==", projectId),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...(document.data() as DocumentData),
  }));
};

export const updateDocument = async (
  documentId: string,
  content: string
) => {
  const documentRef = doc(
    db,
    "documents",
    documentId
  );

  await updateDoc(documentRef, {
    content,
    updatedAt: serverTimestamp(),
  });
};

// Delete document
export const deleteDocument = async (
  documentId: string
) => {
  const documentRef = doc(
    db,
    "documents",
    documentId
  );

  await deleteDoc(documentRef);
};