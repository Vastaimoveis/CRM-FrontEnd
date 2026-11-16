import { type PageResponse, type ApiResponse } from "@/shared/types/api";
import { api } from "../api/api";
import { unwrapApiResponse } from "../api/unwrap";
import type { CreateScript, Script, ScriptFilterCategory, UpdateScript } from "./ScriptTypes";
import { ApiError } from "@/shared/types/ApiError";

export async function createScript(data: CreateScript): Promise<Script> {
    const response = await api.post<ApiResponse<Script>>(`/scripts`, data)

    return unwrapApiResponse(response.data);
}

export async function findAllScript(
    page = 0,
    size = 10
): Promise<PageResponse<Script>> {
    const response = await api.get<ApiResponse<PageResponse<Script>>>(
        "/scripts",
        { params: { page, size } }
    );

    return unwrapApiResponse(response.data);
}

export async function searchScript(
    search: string,
    page = 0,
    size = 10
): Promise<PageResponse<Script>> {
    const response = await api.get<ApiResponse<PageResponse<Script>>>(
        "/scripts/search",
        {
            params: {
                query: search,
                page,
                size,
            },
        }
    );

    return unwrapApiResponse(response.data);
}

export async function filterScriptCategory(data: ScriptFilterCategory, page = 0, size = 10): 
    Promise<PageResponse<Script>> {
    const response = await api.get("/scripts/filter", {
        params: {
            ...(data.category && { category: data.category }),
            page,
            size
        }
    });

    return unwrapApiResponse(response.data);
}

export async function findScriptById(id: string): Promise<Script> {
    const response = await api.get<ApiResponse<Script>>(`/scripts/${id}`)

    return unwrapApiResponse(response.data);
}

export async function updateScript(data: UpdateScript): Promise<Script> {
    const { id, ...updateData } = data;

    const response = await api.patch<ApiResponse<Script>>(
        `/scripts/${id}`,
        updateData
    );

    return unwrapApiResponse(response.data);
}

export async function deleteScript(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<null>>(`/scripts/${id}`);

    if (!response.data || response.data.success !== true) {
        throw new ApiError(
            response.data?.message || "Erro ao excluir script",
            response.data?.errorCode ?? null
        );
    }
}