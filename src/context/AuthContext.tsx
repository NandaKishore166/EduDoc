import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";
import type { AppUser } from "../types/user";

interface AuthContextType {
  firebaseUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  appUser: null,
  loading: true,
});

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        try {
          setFirebaseUser(user);

          if (!user) {
            setAppUser(null);
            return;
          }

          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            setAppUser(snap.data() as AppUser);
          } else {
            setAppUser(null);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          setAppUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        appUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);