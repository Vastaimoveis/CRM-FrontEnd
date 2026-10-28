import type { ApiResponse, PageResponse } from "@/shared/types/api"
import type { RegioesEnum, User } from "@/shared/types/UserTypes"
import { api } from "../api/api"
import { unwrapApiResponse } from "../api/unwrap"
import { SYSTEM_ROLES } from "../roles/roleTypes";

export interface CreateUserDTO {
    nome: string,
    telefone: string,
    email: string,
    password: string,
    regiao: RegioesEnum,
    role: string | undefined,
}


export interface CorretorResponse {
    id: string;
    nome: string;
    role: string;
}



export async function getCorretores() {
    const response = await api.get("/users?size=100");

    const users = response.data?.data?.content;

    if (!Array.isArray(users)) {
        throw new Error(
            "Formato inesperado na resposta da API de usuários"
        );
    }

    return users.filter(
        user => user.role?.name === SYSTEM_ROLES.CORRETOR
    );
}



export async function getUserById(userId: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`)


    return unwrapApiResponse(response.data);
}

export async function getAllUsers(): Promise<PageResponse<User>> {
    const response = await api.get<ApiResponse<PageResponse<User>>>(`/users`)


    return unwrapApiResponse(response.data);;
}

export async function updateUser(user: User) {
    const response = await api.put<ApiResponse<User>>(`/users/${user.id}`, user);


    return unwrapApiResponse(response.data);;
}

export async function createUser(userDto: CreateUserDTO) {
    const response = await api.post<ApiResponse<User>>(`/users`, userDto)


    return unwrapApiResponse(response.data);
}