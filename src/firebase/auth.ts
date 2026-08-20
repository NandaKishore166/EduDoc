import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";






export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};


const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = (
  email: string,
  password: string
) => createUserWithEmailAndPassword(auth, email, password);

export const loginWithEmail = (
  email: string,
  password: string
) => signInWithEmailAndPassword(auth, email, password);

export const loginWithGoogle = () =>
  signInWithPopup(auth, googleProvider);


export const logout = () => signOut(auth);