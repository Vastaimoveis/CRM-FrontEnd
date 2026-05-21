import type { ApiResponse, PageResponse } from "@/shared/types/api";
import { api } from "../api/api";
import type {
    CreateLeadDTO,
    Lead,
} from "@/shared/types/LeadType";

interface LeadsResponse {
    success: boolean;
    data: {
        content: Lead[];
    };
    message: string;
}

export async function getLeads(
    page = 0
): Promise<PageResponse<Lead>> {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads?page=${page}`);

    return response.data.data;
}

export async function getLeadById(
    id: string
): Promise<Lead> {

    const response = await api.get<
        ApiResponse<Lead>
    >(`/leads/${id}`);

    return response.data.data;
}

export async function createLeadRequest(
    data: CreateLeadDTO
): Promise<Lead> {

    const response = await api.post<
        ApiResponse<Lead>
    >("/leads", data);

    return response.data.data;
}

export async function updateLeadRequest(
    id: string,
    data: CreateLeadDTO
): Promise<Lead> {

    const response = await api.put<
        ApiResponse<Lead>
    >(`/leads/${id}`, data);

    return response.data.data;
}

export async function deleteLeadRequest(
    id: string
): Promise<void> {

    await api.delete(`/leads/${id}`);
}