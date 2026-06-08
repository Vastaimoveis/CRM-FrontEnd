import type { ApiResponse, PageResponse } from "@/shared/types/api"
import type { RegioesEnum, User, UserRoles } from "@/shared/types/UserTypes"
import { api } from "../api/api"

export interface CreateUserDTO {
    nome: string,
    telefone: string,
    email: string,
    password: string,
    regiao: RegioesEnum
    role: UserRoles
}

export async function getUserById(userId: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${userId}`)

    return response.data.data
}

export async function getAllUsers():Promise<PageResponse<User>> {
    const response = await api.get<ApiResponse<PageResponse<User>>>(`/users`)

    return response.data.data;
}

export async function updateUser(user: User) {
    const response = await api.put<ApiResponse<User>>(`/users/${user.id}`, user);

    return response.data.data;
}

export async function createUser(userDto: CreateUserDTO) {
    const response = await api.post<ApiResponse<User>>(`/users`, userDto)

    return response.data.data
}