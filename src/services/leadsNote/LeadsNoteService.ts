import type { LeadNotes } from "@/shared/types/LeadNotesType";
import { api } from "../api/api";
import type { ApiResponse, PageResponse } from "@/shared/types/api";


interface LeadNoteResponse {
    success: boolean;
    data: {
        content: LeadNotes[]
    };

    message: string;
}

interface CreateLeadNoteDto {
    leadId: string,
    note: string
}

export async function fetchLeadNoteById(
    leadId: string,
    page = 0
): Promise<PageResponse<LeadNotes>> {
    const response = await api.get<ApiResponse<PageResponse<LeadNotes>>>(`/leadsNote?page=${page}&id=${leadId}`);

    return response.data.data;
}

export async function createLeadNote(
    data: CreateLeadNoteDto): Promise<LeadNotes> {
    const response = await api.post<ApiResponse<LeadNotes>>(`/leadsNote`, data);

    return response.data.data;
}