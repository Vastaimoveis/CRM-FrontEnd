import { createLeadNote, getLeadNoteByLead } from "@/services/leadsNote/LeadsNoteService";
import { type LeadNoteRequest, type LeadNotes } from "@/shared/types/LeadNotesType";
import { createContext, useContext, useState, type ReactNode } from "react"


interface LeadNotesContextType {
    leadNotes: LeadNotes[];
    noteLoading: boolean;

    createNewLeadNote: (data: LeadNoteRequest) => Promise<void>;

    fetchLeadNotesByLead: (id: string, page: number) => Promise<void>;
}

const LeadNotesContext = createContext<LeadNotesContextType | null>(null);

export function LeadNotesProvider({ children }: { children: ReactNode }) {
    const [leadNotes, setLeadNotes] = useState<LeadNotes[]>([]);
    const [noteLoading, setNoteLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0)

    async function createNewLeadNote(data: LeadNoteRequest) {
        await createLeadNote(data)

    }

    async function fetchLeadNotesByLead(id: string, actualPage: number) {
        setNoteLoading(true)
        setPage(actualPage);

        try {
            const response = await getLeadNoteByLead(id, page);
            setTotalPages(response.totalPages)
            if (response.totalPages >= page) {
                setLeadNotes(response.content);
            }
        } finally {
            setNoteLoading(false)
        }
    }

    return (
        <LeadNotesContext.Provider value={{
            leadNotes,
            noteLoading,
            createNewLeadNote,
            fetchLeadNotesByLead
        }}>
            {children}
        </LeadNotesContext.Provider>
    )
}

export function useLeadNotes() {
    const context = useContext(LeadNotesContext);
    if (!context) {
        throw new Error("useLeadNotes deve ser usado dentro de LeadNotesProvider")
    }
    return context;
}