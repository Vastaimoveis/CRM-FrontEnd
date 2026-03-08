import { Navigate } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import type { JSX } from "react";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();

  if (loading) return null;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}