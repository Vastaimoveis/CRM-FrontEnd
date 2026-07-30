import { findAll } from "@/services/roles/rolesService";
import type { RoleResponseDTO } from "@/services/roles/roleTypes";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthProvider";

interface RoleContext {
    userRole: RoleResponseDTO | null;
    roles: RoleResponseDTO[];
}

const RoleContext = createContext<RoleContext | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState<RoleResponseDTO | null>(null)
    const [roles, setRoles] = useState<RoleResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRoles() {
            findAll().then((res) => setRoles(res)).finally(() => setLoading(false));
            if (!user) return;
            setUserRole(user.role);
        } loadRoles();

    },
        []);

    const value = useMemo(() => ({
        roles,
        userRole,
    }), [
        roles,
        userRole,
    ])

    return (
        <RoleContext.Provider
            value={value}
        >

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