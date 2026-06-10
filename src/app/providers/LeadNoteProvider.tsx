import { createLeadNote, getLeadNoteByLead } from "@/services/leadsNote/LeadsNoteService";
import { type LeadNoteRequest, type LeadNotes } from "@/shared/types/LeadNotesType";
import type { Lead } from "@/shared/types/LeadType";
import { createContext, useContext, useState, type ReactNode } from "react"


interface LeadNotesContextType {
    leadNotes: LeadNotes[];
    totalPages: number;
    noteLoading: boolean;

    selectedLead: Lead | null;
    newNote: string;
    saving: boolean;

    setNewNote: React.Dispatch<React.SetStateAction<string>>;

    openNotes: (lead: Lead) => Promise<void>;
    closeNotes: () => void;

    addNote: () => Promise<void>;

    createNewLeadNote: (
        data: LeadNoteRequest
    ) => Promise<void>;

    fetchLeadNotesByLead: (
        id: string,
        page: number
    ) => Promise<void>;
}

const LeadNotesContext = createContext<LeadNotesContextType | null>(null);

export function LeadNotesProvider({ children }: { children: ReactNode }) {
    const [leadNotes, setLeadNotes] = useState<LeadNotes[]>([]);
    const [noteLoading, setNoteLoading] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [page, setPage] = useState<number>(0)
    const [selectedLead, setSelectedLead] =
        useState<Lead | null>(null);

    const [newNote, setNewNote] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    async function createNewLeadNote(data: LeadNoteRequest) {
        await createLeadNote(data)

    }

    async function openNotes(lead: Lead) {

        setSelectedLead(lead);

        await fetchLeadNotesByLead(
            lead.id,
            0
        );
    }

    function closeNotes() {

        setSelectedLead(null);

        setNewNote("");

        setLeadNotes([]);
    }

    async function addNote() {

        if (!selectedLead || !newNote.trim())
            return;

        setSaving(true);

        try {

            const dto: LeadNoteRequest = {
                leadId: selectedLead.id,
                note: newNote.trim(),
            };

            await createLeadNote(dto);

            await fetchLeadNotesByLead(
                selectedLead.id,
                0
            );

            setNewNote("");

        } finally {

            setSaving(false);

        }
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
            totalPages,
            addNote,
            closeNotes,
            newNote,
            openNotes,
            saving,
            selectedLead,
            setNewNote,
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