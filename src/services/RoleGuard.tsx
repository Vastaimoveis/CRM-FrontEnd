import { useRole } from "@/app/providers/RoleProvider";
import type { PermissionName } from "./permission/permissionTypes";

interface RoleGuardProps {
  permission: PermissionName;
  children: React.ReactNode;
}

export function RoleGuard({ permission, children }: RoleGuardProps) {
  const { hasPermission } = useRole();
      if (!hasPermission(permission)) {
          return null;
      }

  return <>{children}</>;
}