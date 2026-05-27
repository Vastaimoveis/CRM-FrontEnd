import type { ApiResponse, PageResponse } from "@/shared/types/api";
import { api } from "../api/api";
import {
    LeadStatus,
    type CreateLeadDTO,
    type Lead,
} from "@/shared/types/LeadType";

export interface countStatusResponse {
    total: number,
    porStatus: Record<LeadStatus, number>;
}

export interface LeadStatusChartData {
    status: LeadStatus;
    total: number;
}

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

export async function getLeadsByUserId(userId: string) {
    const response = await api.get<ApiResponse<Lead[]>>(`/leads/all/${userId}`)
    return response.data.data
}

export async function getLeadsStatus() {
    const response = await api.get<ApiResponse<countStatusResponse>>(`leads/dashboard`);
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