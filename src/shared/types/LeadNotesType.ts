
export interface LeadNotes {
    id: string,
    LeadId: string,
    note: string,
    creationDate: Date
}

export interface LeadNoteRequest {
    leadId: string,
    note: string
}