import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
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

export const createProject = async (
  project: ProjectData
) => {
  await addDoc(collection(db, "projects"), {
    title: project.title,
    guide: project.guide,
    domain: project.domain,
    type: project.type,
    description: project.description,
    status: project.status,
    ownerId: project.ownerId,
    createdAt: serverTimestamp(),
  });
};

export const getProjects = async (
  ownerId: string
) => {
  const q = query(
    collection(db, "projects"),
    where("ownerId", "==", ownerId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((projectDoc) => ({
    id: projectDoc.id,
    ...(projectDoc.data() as ProjectData),
  }));
};

export const getProject = async (
  projectId: string
) => {
  const projectRef = doc(
    db,
    "projects",
    projectId
  );

  const snapshot = await getDoc(projectRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as ProjectData),
  };
};