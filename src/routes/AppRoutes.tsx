import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import NewProject from "../pages/NewProject";
import ProtectedRoute from "./ProtectedRoute";
import AIAssistant from "../pages/AIAssistant";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/new"
        element={
          <ProtectedRoute>
            <NewProject />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

<Route
  path="/ai"
  element={
    <ProtectedRoute>
      <AIAssistant />
    </ProtectedRoute>
  }
/>