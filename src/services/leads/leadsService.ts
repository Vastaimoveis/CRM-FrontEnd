import type { ApiResponse, PageResponse } from "@/shared/types/api";
import { api } from "../api/api";
import {
    LeadStatus,
    type CreateLeadDTO,
    type Lead,
} from "@/shared/types/LeadType";
import type { countStatusResponse, LeadStatusDTO } from "./types/leads";
import { UserRoles, type User } from "@/shared/types/UserTypes";

export const EMPTY_LEADS_COUNT: countStatusResponse = {
    total: 0,
    porStatus: {
        [LeadStatus.CADASTRADO]: 0,
        [LeadStatus.ATENDIMENTO]: 0,
        [LeadStatus.AGUARDANDO]: 0,
        [LeadStatus.VISITA]: 0,
        [LeadStatus.NEGOCIACAO]: 0,
        [LeadStatus.VENDA]: 0,
        [LeadStatus.ENCERRADO]: 0,
    },
};

export async function getLeads(
    page = 0
): Promise<PageResponse<Lead>> {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads?page=${page}`);

    return response.data.data;
}

export async function getOportunity() {
    const response = await api.get<ApiResponse<Lead[]>>(`leads/oportunidades`);

    return response.data.data;
}

export async function getLeadsBySearch(search: string, page: number) {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads/search/${search}?page=${page}`);

    return response.data.data;
}

export async function getLeadsByUserId(userId: string) {
    const response = await api.get<ApiResponse<Lead[]>>(`/leads/all/${userId}`)
    return response.data.data
}

export async function getLeadsStatus() {
    const response = await api.get<ApiResponse<countStatusResponse>>(`leads/dashboard`);
    return response.data.data;
}

export async function getLeadsFilterByStatus(status: LeadStatusDTO, page = 0) {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(
        `/leads/status/${status.statusLead}?page=${page}`);

    return response.data.data;
}

export async function getAllLeadsNotEncerrado(page = 0, user: User | null) {
    if (!user) {
        return
    } else if (user.role == UserRoles.GERENTE) {
        const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads/status?page=${page}`);

        return response.data.data;
    } else {
        const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads/status/userid/${user.id}?page=${page}`);
        return response.data.data;
    }
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

export async function patchStatus(id: string, data: LeadStatusDTO): Promise<Lead> {
    const response = await api.patch<
        ApiResponse<Lead>
    >(`/leads/${id}/status`, data);

    return response.data.data;
}

export async function getFilteredLeads(
    search: string | null,
    status: LeadStatus | null,
    userId: string | null,
    page = 0
) {

    const params = new URLSearchParams();
    if (search) {
        params.append("search", search);
    }
    if (status) {
        params.append("status", status);
    }
    if (userId) {
        params.append("userId", userId);
    }
    params.append("page", String(page));
    const response = await api.get(
        `/leads/filter?${params.toString()}`
    );
    return response.data.data;
}

export async function deleteLeadRequest(
    id: string
): Promise<void> {

    await api.delete(`/leads/${id}`);
}