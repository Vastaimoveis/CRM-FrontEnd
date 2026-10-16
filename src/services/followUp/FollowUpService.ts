import { api } from "../api/api";
import { unwrapApiResponse } from "../api/unwrap";

import type {
    FollowUp,
    CreateFollowUpRequest,
    RescheduleFollowUpRequest,
    FollowUpStatusCount,
} from "@/shared/types/followUpTypes";

import type { ApiResponse, PageResponse } from "@/shared/types/api";
import type { FollowUpFilters } from "@/shared/types/filterTypes";


// ======================================================
// FOLLOW-UPS
// ======================================================

export async function getFollowUps(
    page = 0,
    size = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<ApiResponse<PageResponse<FollowUp>>>(
        "/follow-ups",
        {
            params: {
                page,
                size,
            },
        }
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// FOLLOW-UPS DE UM LEAD
// ======================================================

export async function getFollowUpsByLead(
    leadId: string,
    page = 0,
    size = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<ApiResponse<PageResponse<FollowUp>>>(
        `/follow-ups/lead/${leadId}`,
        {
            params: {
                page,
                size,
            },
        }
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// FOLLOW-UP POR ID
// ======================================================

export async function getFollowUpById(
    id: string
): Promise<FollowUp> {

    const response = await api.get<ApiResponse<FollowUp>>(
        `/follow-ups/${id}`
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// CRIAR CICLO
// ======================================================

export async function createFollowUp(
    leadId: string,
    data: CreateFollowUpRequest
): Promise<FollowUp> {

    const response = await api.post<ApiResponse<FollowUp>>(
        `/follow-ups/lead/${leadId}`,
        data
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// CONCLUIR FOLLOW-UP
// ======================================================

export async function completeFollowUp(
    id: string
): Promise<FollowUp> {

    const response = await api.post<ApiResponse<FollowUp>>(
        `/follow-ups/${id}/complete`
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// REAGENDAR FOLLOW-UP
// ======================================================

export async function rescheduleFollowUp(
    data: RescheduleFollowUpRequest
): Promise<FollowUp> {

    const response = await api.post<ApiResponse<FollowUp>>(
        `/follow-ups/${data.id}/reschedule`,
        data
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// AGENDAR PRÓXIMO FOLLOW-UP
// ======================================================

export async function scheduleNextFollowUp(
    id: string,
    data: CreateFollowUpRequest
): Promise<FollowUp> {

    const response = await api.post<ApiResponse<FollowUp>>(
        `/follow-ups/${id}/next`,
        data
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// FOLLOW-UPS ATUAIS — ADMIN / GESTOR
// ======================================================

export async function getCurrentFollowUps(
    page = 0,
    size = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<ApiResponse<PageResponse<FollowUp>>>(
        "/follow-ups/current",
        {
            params: {
                page,
                size,
            },
        }
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// CONTAGEM POR STATUS — ADMIN / GESTOR
// ======================================================

export async function getCurrentFollowUpCountByStatus(): Promise<
    FollowUpStatusCount[]
> {

    const response = await api.get<ApiResponse<FollowUpStatusCount[]>>(
        "/follow-ups/current/count-by-status"
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// FOLLOW-UPS ATUAIS DO USUÁRIO AUTENTICADO
// ======================================================

export async function getMyCurrentFollowUps(
    page = 0,
    size = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<ApiResponse<PageResponse<FollowUp>>>(
        "/follow-ups/current/me",
        {
            params: {
                page,
                size,
            },
        }
    );

    return unwrapApiResponse(response.data);
}


// ======================================================
// CONTAGEM POR STATUS — USUÁRIO AUTENTICADO
// ======================================================

export async function getMyCurrentFollowUpCountByStatus():
    Promise<FollowUpStatusCount[]> {

    const response = await api.get(
        "/follow-ups/current/me/count-by-status"
    );

    const result = unwrapApiResponse<FollowUpStatusCount[]>(
        response.data
    );

    return result;
}
export async function getCurrentFollowUpsByUser(
    userId: string,
    page = 0,
    size = 10
): Promise<PageResponse<FollowUp>> {

    const response =
        await api.get<ApiResponse<PageResponse<FollowUp>>>(
            `/follow-ups/current/user/${userId}`,
            {
                params: {
                    page,
                    size,
                },
            }
        );

    return unwrapApiResponse(response.data);
}

// FILTERS
function buildFollowUpParams(
    filters: FollowUpFilters,
    page: number,
    size: number
) {
    return {
        ...(filters.search?.trim() && {
            search: filters.search.trim()
        }),

        ...(filters.status && {
            status: filters.status
        }),

        ...(filters.userId && {
            userId: filters.userId
        }),

        ...(filters.startDate && {
            startDate: filters.startDate
        }),

        ...(filters.endDate && {
            endDate: filters.endDate
        }),

        page,
        size
    };
}

export async function getMyFilteredFollowUps(
    filters: FollowUpFilters = {},
    page: number = 0,
    size: number = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<
        ApiResponse<PageResponse<FollowUp>>
    >(
        "/follow-ups/filter/me",
        {
            params: buildFollowUpParams(
                filters,
                page,
                size
            )
        }
    );

    return unwrapApiResponse(response.data);
}

export async function getAllFilteredFollowUps(
    filters: FollowUpFilters = {},
    page: number = 0,
    size: number = 10
): Promise<PageResponse<FollowUp>> {

    const response = await api.get<
        ApiResponse<PageResponse<FollowUp>>
    >(
        "/follow-ups/filter",
        {
            params: buildFollowUpParams(
                filters,
                page,
                size
            )
        }
    );

    return unwrapApiResponse(response.data);
}