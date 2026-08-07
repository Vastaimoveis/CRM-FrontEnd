import type { RegioesEnum } from "@/shared/types/UserTypes";
import type { RoleResponseDTO } from "../roles/roleTypes";

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        nome: string;
        email: string;
        telefone: string;
        regiao: RegioesEnum;
        role: RoleResponseDTO;
    }
}
