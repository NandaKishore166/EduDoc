import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface ProjectData {
  id?: string;

  title: string;
  guide: string;

  domain: string;
  type: string;
  description: string;

  status: string;
  ownerId: string;

  createdAt?: any;
}

export const createProject = async (project: ProjectData) => {
  await addDoc(collection(db, "projects"), {
    ...project,
    createdAt: serverTimestamp(),
  });
};

export const getProjects = async (ownerId: string) => {
  const q = query(
    collection(db, "projects"),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as ProjectData),
  }));
};