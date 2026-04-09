import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  /** If true, only food partners can access this route */
  partnerOnly?: boolean;
}

export default function ProtectedRoute({ children, partnerOnly = false }: ProtectedRouteProps) {
  const { auth } = useAuth();

  if (!auth) {
    return <Navigate to="/signin" replace />;
  }

  if (partnerOnly && auth.type !== "partner") {
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
}
