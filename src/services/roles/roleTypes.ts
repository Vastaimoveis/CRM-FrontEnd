
export interface RoleResponseDTO{
    id: string,
    name: SYSTEM_ROLES, 
    description: string,
}

export const SYSTEM_ROLES = {
    ADMIN: "ADMIN",
    GERENTE: "GERENTE",
    CORRETOR: "CORRETOR"
} as const;

export type SYSTEM_ROLES = (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
