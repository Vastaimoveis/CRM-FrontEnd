import type { RegioesEnum, UserRoles } from "@/shared/types/UserTypes";

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    success: boolean;
    data: {
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            nome: string;
            email: string;
            telefone: string;
            role: UserRoles;
            regiao: RegioesEnum;
        }
    }
    text: string;
}