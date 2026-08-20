import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase/config";

const provider = new GoogleAuthProvider();

export const register = async (
  name: string,
  email: string,
  password: string
) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    name,
    email,
    role: "student",
    createdAt: serverTimestamp(),
  });

  return credential.user;
};

export const login = (
  email: string,
  password: string
) => signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, provider);

  const userRef = doc(db, "users", credential.user.uid);

  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: credential.user.uid,
      name: credential.user.displayName,
      email: credential.user.email,
      photoURL: credential.user.photoURL,
      role: "student",
      createdAt: serverTimestamp(),
    });
  }

  return credential.user;
};

export const logout = () => signOut(auth);