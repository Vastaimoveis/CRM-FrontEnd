import type { ApiResponse } from "@/shared/types/api";
import { api } from "../api/api";
import type { RoleResponseDTO } from "./roleTypes";
import { unwrapApiResponse } from "../api/unwrap";

export async function findById(id: string): Promise<ApiResponse<RoleResponseDTO>> {
    const response = await api.get<ApiResponse<RoleResponseDTO>>(`/role/${id}`)

    return response.data;
}

export async function findAll(): Promise<RoleResponseDTO[]> {
    const response = await api.get<ApiResponse<RoleResponseDTO[]>>(`/role`)

    return unwrapApiResponse(response.data);
}

