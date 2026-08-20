import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return firebaseUser ? <>{children}</> : <Navigate to="/login" replace />;
}