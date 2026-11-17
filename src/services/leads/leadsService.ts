import type { ApiResponse, PageResponse } from "@/shared/types/api";
import { api } from "../api/api";
import {
    LeadStatus,
    type CreateLeadDTO,
    type Lead,
    type LeadPorCorretor,
} from "@/shared/types/LeadType";
import type { countStatusResponse, LeadCorretorDTO, LeadStatusDTO, UpdateLeadDto } from "./types/leads";
import { type User } from "@/shared/types/UserTypes";
import type { LeadFilters } from "@/shared/types/filterTypes";
import { unwrapApiResponse } from "../api/unwrap";
import { SYSTEM_ROLES } from "../roles/roleTypes";

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

    return unwrapApiResponse(response.data);
}

export async function getOportunity(userId: string): Promise<Lead[]> {
    const response = await api.get<ApiResponse<Lead[]>>(`leads/oportunidades/${userId}`);


    return unwrapApiResponse(response.data);
}

export async function getLeadsBySearch(search: string, page: number): Promise<PageResponse<Lead>> {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(`/leads/search/${search}?page=${page}`);


    return unwrapApiResponse(response.data);
}

export async function getLeadsByUserId(userId: string): Promise<Lead[]> {
    const response = await api.get<ApiResponse<Lead[]>>(
        `/leads/all/${userId}`
    );

    return unwrapApiResponse(response.data);
}

export async function getLeadsStatus(userId: string): Promise<countStatusResponse> {
    const response = await api.get<ApiResponse<countStatusResponse>>(`leads/dashboard/${userId}`);

    return unwrapApiResponse(response.data);
}

export async function getLeadsFilterByStatus(status: LeadStatusDTO, page = 0) {
    const response = await api.get<ApiResponse<PageResponse<Lead>>>(
        `/leads/status/${status.statusLead}?page=${page}`);


    return unwrapApiResponse(response.data);
}

export async function getAllLeadsNotEncerrado(
    page = 0,
    user: User | null
): Promise<PageResponse<Lead> | null> {
    if (!user) return null;

    const endpoint =
        user.role.name === SYSTEM_ROLES.GERENTE
            ? `/leads/status?page=${page}`
            : `/leads/status/userid/${user.id}?page=${page}`;

    const response = await api.get<ApiResponse<PageResponse<Lead>>>(endpoint);

    return unwrapApiResponse(response.data);
}

export async function getLeadById(
    id: string
): Promise<Lead> {

    const response = await api.get<
        ApiResponse<Lead>
    >(`/leads/${id}`);


    return unwrapApiResponse(response.data);
}

export async function createLeadRequest(
    data: CreateLeadDTO
): Promise<Lead> {

    const response = await api.post<
        ApiResponse<Lead>
    >("/leads", data);

    return unwrapApiResponse(response.data);
}

export async function updateLeadRequest(
    id: string,
    data: CreateLeadDTO
): Promise<Lead> {

    const response = await api.put<
        ApiResponse<Lead>
    >(`/leads/${id}`, data);

    return unwrapApiResponse(response.data);
}

export async function patchStatus(id: string, data: LeadStatusDTO): Promise<Lead> {
    const response = await api.patch<
        ApiResponse<Lead>
    >(`/leads/${id}/status`, data);


    return unwrapApiResponse(response.data);
}

export async function patchCorretor(leadId: string, data: LeadCorretorDTO): Promise<Lead> {
    const response = await api.patch<
        ApiResponse<Lead>>(`/leads/${leadId}/corretor`, data);

    return unwrapApiResponse(response.data);
}


export async function getFilteredLeads(
    filter: LeadFilters
): Promise<PageResponse<Lead>> {
    const params = new URLSearchParams();

    if (filter.userId) params.append("userId", filter.userId);
    if (filter.search) params.append("search", filter.search.toString());
    if (filter.status) params.append("status", filter.status);
    if (filter.startDate) params.append("startDate", filter.startDate);
    if (filter.endDate) params.append("endDate", filter.endDate);

    params.append("page", String(filter.page));
    console.log("Parâmetros da requisição:", params.toString());


    const response = await api.get<ApiResponse<PageResponse<Lead>>>(
        `/leads/filter?${params.toString()}`
    );

    return unwrapApiResponse(response.data);
}

export async function editLead(
    id: string,
    data: UpdateLeadDto
): Promise<Lead> {
    const response = await api.put<ApiResponse<Lead>>(
        `/leads/${id}`,
        data
    );

    return unwrapApiResponse(response.data);
}

export async function deleteLeadRequest(
    id: string
): Promise<void> {

    await api.delete(`/leads/${id}`);
}

export async function getLeadsPorCorretor(): Promise<LeadPorCorretor[]> {
    const response = await api.get<
        ApiResponse<LeadPorCorretor[]>
    >("/leads/por-corretor");

    return unwrapApiResponse(response.data);
}
