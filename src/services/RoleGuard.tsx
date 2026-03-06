import { Navigate } from "react-router-dom";
import type { UserRoles } from "../types/UserTypes";
import { useAuth } from "../context/AuthContext";

interface RoleGuardProps {
  allowed: UserRoles[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowed.includes(user.role)) {
    return <Navigate to="/funil" replace />;
  }

  return <>{children}</>;
}