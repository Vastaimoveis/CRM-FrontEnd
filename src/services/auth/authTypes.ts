import type { RegioesEnum, UserRoles } from "@/shared/types/UserTypes";

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    success: boolean;
    data: {
        token: string;


        user: {
            id: string;
            name: string;
            email: string;
            telefone: string;
            role: UserRoles;
            regiao: RegioesEnum;
        }
    }
    text: string;
}