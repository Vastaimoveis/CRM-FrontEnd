import type { LeadNotes } from "@/shared/types/LeadNotes";
import { useState } from "react";

export default function LeadsNotesModal() {
    const [openNotesLeadId, setOpenNotesLeadId] = useState<string | null>(null);
    const [notes, setNotes] = useState<LeadNotes[]>([]);
    const [loadingNotes, setLoadingNotes] = useState(false);

    //mudar para o utils futuramente
    async function fetchNotes(leadId: string) {
        try {
            setLoadingNotes(true);

            const response = await fetch(`/api/leads/${leadId}/notes`);
            const data = await response.json();

            setNotes(data);
        } catch (error) {
            console.error("Erro ao buscar anotações:", error);
            setNotes([]);
        } finally {
            setLoadingNotes(false);
        }
    }


}