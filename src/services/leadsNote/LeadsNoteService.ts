import type { LeadNotes } from "@/shared/types/LeadNotesType";
import { api } from "../api/api";
import type { ApiResponse, PageResponse } from "@/shared/types/api";
import { unwrapApiResponse } from "../api/unwrap";

interface CreateLeadNoteDto {
    leadId: string,
    note: string
}

export async function getLeadNoteByLead(
    leadId: string,
    page = 0
): Promise<PageResponse<LeadNotes>> {
    const response = await api.get<ApiResponse<PageResponse<LeadNotes>>>(`/leadNotes/${leadId}?page=${page}`);

    return unwrapApiResponse(response.data);
}

export async function createLeadNote(
    data: CreateLeadNoteDto): Promise<LeadNotes> {
    const response = await api.post<ApiResponse<LeadNotes>>(`/leadNotes`, data);

    return unwrapApiResponse(response.data);
}