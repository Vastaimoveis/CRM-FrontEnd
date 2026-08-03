import type { ApiResponse } from "@/shared/types/api";
import type { PermissionResponseDTO } from "./permissionTypes";
import { api } from "../api/api";

export async function findAllPermissions(): Promise<ApiResponse<PermissionResponseDTO[]>> {
    const response = await api.get<ApiResponse<PermissionResponseDTO[]>>(`/permission`)
    return response.data;
}

export async function findPermissionById(id:String): Promise<ApiResponse<PermissionResponseDTO>> {
    const response = await api.get<ApiResponse<PermissionResponseDTO>>(`/permission/${id}`)
    return response.data
}