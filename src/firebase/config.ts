import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAONbI3CfDDITYDZFWVBLc42aXiauxzuOU",
  authDomain: "edudoc-ai-89de3.firebaseapp.com",
  projectId: "edudoc-ai-89de3",
  storageBucket: "edudoc-ai-89de3.firebasestorage.app",
  messagingSenderId: "924876487112",
  appId: "1:924876487112:web:8f7f4368f24bb943efe8fd",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;