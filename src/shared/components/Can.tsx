import { useRole } from "@/app/providers/Role/RoleProvider";
import type { PermissionName } from "@/services/permission/permissionTypes";
import type { ReactNode } from "react";

interface CanProps {
    permission: PermissionName;
    children: ReactNode;

} export function Can({ permission, children }: CanProps) {
    const { hasPermission } = useRole();
    if (!hasPermission(permission)) {
        return null;
    }
    return <>
        {children}
    </>;
}