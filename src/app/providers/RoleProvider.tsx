import { findAllRoles } from "@/services/roles/rolesService";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { PermissionName } from "@/services/permission/permissionTypes";
import type { RoleResponseDTO } from "@/services/roles/roleTypes";

interface RoleContext {
    userRole: RoleResponseDTO | null;
    roles: RoleResponseDTO[];
    loading: boolean;
    permissions: string[];
    hasRole: (roleName: string) => boolean;
    hasPermission: (permission: PermissionName) => boolean;
}

const RoleContext = createContext<RoleContext | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
    const { user, isCorretor, loadingAuth } = useAuth();
    const [roles, setRoles] = useState<RoleResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const permissionSet = useMemo(() => new Set<PermissionName>(user?.role?.permissions?.map((p) => p.name) ?? []), [user]);

    const permissions = useMemo(() => Array.from(permissionSet), [permissionSet]);


    useEffect(() => {
        if(loadingAuth) return;

        if(isCorretor) return;

        async function loadRoles() {
            try {
                const response = await findAllRoles();
                if (!response.data) return;
                setRoles(response.data);
            } finally {
                setLoading(false);
            }
        } loadRoles();
    },
        []);


    const value = useMemo(() => (
        {
            roles,
            userRole: user?.role ?? null,
            loading,
            permissions,
            hasRole: (roleName: string) => user?.role?.name === roleName,
            hasPermission: (permission: PermissionName) => permissionSet.has(permission)
        }), [
        roles,
        user,
        loading,
        permissions,

    ]);

    return (
        <RoleContext.Provider
            value={value}
        >
            {children}
        </RoleContext.Provider>
    )
}

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error("useRole deve ser usado dentro de RoleProvider");
    }
    return context;
}