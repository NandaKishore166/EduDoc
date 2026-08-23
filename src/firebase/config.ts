import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "edudoc-ai-89de3.firebaseapp.com",
  projectId: "edudoc-ai-89de3",
  storageBucket: "edudoc-ai-89de3.firebasestorage.app",
  messagingSenderId: "924876487112",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

// App Check debug mode for localhost
if (import.meta.env.DEV) {
  (
    self as typeof self & {
      FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
    }
  ).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// App Check
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("none"),
  isTokenAutoRefreshEnabled: true,
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;