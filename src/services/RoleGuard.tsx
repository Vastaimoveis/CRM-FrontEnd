import { Navigate } from "react-router-dom";
import type { UserRoles } from "../shared/types/UserTypes";
import { useAuth } from "@/app/providers/AuthProvider";

interface RoleGuardProps {
  allowed: UserRoles[];
  children: React.ReactNode;
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { user, loading } = useAuth();
  console.log("ROLE CHECK", {
    userRole: user?.role,
    allowed,
    match: allowed.includes(user?.role as any),
  });
  if (loading) return null;

  if (!user || !allowed.includes(user.role as UserRoles)) {
    return <Navigate to="/funil" replace />;
  }

  return <>{children}</>;
}