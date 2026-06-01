
export interface LeadNotes {
    id: string,
    LeadId: string,
    note: string,
    createdAt: Date
}

export interface LeadNoteRequest {
    leadId: string,
    note: string
}