import type { ApiResponse } from "@/shared/types/api";
import { api } from "../api/api";
import type { RoleResponseDTO } from "./roleTypes";

export async function findRoleById(id: string): Promise<ApiResponse<RoleResponseDTO>> {
    const response = await api.get<ApiResponse<RoleResponseDTO>>(`/role/${id}`)

    return response.data;
}

export async function findAllRoles(): Promise<ApiResponse<RoleResponseDTO[]>> {
    const response = await api.get<ApiResponse<RoleResponseDTO[]>>(`/role`)

    return response.data;
}

