import { createLeadNote, getLeadNoteByLead } from "@/services/leadsNote/LeadsNoteService";
import { type LeadNoteRequest, type LeadNotes } from "@/shared/types/LeadNotesType";
import type { Lead } from "@/shared/types/LeadType";
import useRequestLock from "@/shared/utils/useRequestLock";
import { useRequestPromise } from "@/shared/utils/useRequestPromise";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"


interface LeadNotesContextType {
    leadNotes: LeadNotes[];
    totalPages: number;
    noteLoading: boolean;
    page: number;
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

    const runLockCreateNote = useRequestLock();
    const runPromiseFetchNote = useRequestPromise();

    const createNewLeadNote = useCallback(async (data: LeadNoteRequest) => {
        await createLeadNote(data)
    }, [
        createLeadNote
    ])

    const fetchLeadNotesByLead = useCallback(async (id: string, actualPage: number) => {
        setNoteLoading(true)

        try {
            runPromiseFetchNote(async () => {
                const response = await getLeadNoteByLead(id, actualPage);
                setTotalPages(response.totalPages)
                setPage(actualPage);
                setLeadNotes(response.content);
            })

        } finally {
            setNoteLoading(false)
        }
    }, [
        setNoteLoading,
        setPage,
        getLeadNoteByLead,
        setTotalPages,

    ])

    const openNotes = useCallback(async (lead: Lead) => {

        setSelectedLead(lead);

        await fetchLeadNotesByLead(
            lead.id,
            0
        );
    }, [
        selectedLead,
        fetchLeadNotesByLead
    ]
    )

    const closeNotes = useCallback(() => {

        setSelectedLead(null);

        setNewNote("");

        setLeadNotes([]);
    }, [
        setSelectedLead,
        setNewNote,
        setLeadNotes,
    ])




    const addNote = useCallback(async () => {

        if (!selectedLead || !newNote.trim())
            return;

        setSaving(true);

        try {
            runLockCreateNote(async () => {
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
            })
        } finally {
            setSaving(false);

        }
    }, [
        selectedLead,
        setSaving,
        createLeadNote,
        fetchLeadNotesByLead,
        setNewNote,

    ])

    const value = useMemo(() => ({
        leadNotes,
        noteLoading,
        totalPages,
        addNote,
        closeNotes,
        page,
        newNote,
        openNotes,
        saving,
        selectedLead,
        setNewNote,
        createNewLeadNote,
        fetchLeadNotesByLead
    }), [
        leadNotes,
        noteLoading,
        totalPages,
        addNote,
        closeNotes,
        page,
        newNote,
        openNotes,
        saving,
        selectedLead,
        setNewNote,
        createNewLeadNote,
        fetchLeadNotesByLead
    ])

    return (
        <LeadNotesContext.Provider value={value}>
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