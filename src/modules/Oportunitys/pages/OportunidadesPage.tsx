import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { useEffect, useMemo, useState } from "react";
import PipelineColumn from "../components/PipelineColumn";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import type { LeadNoteRequest } from "@/shared/types/LeadNotesType";
import Modal from "@/shared/components/leadNotesModal";

export default function OportunidadesPage() {
  const { opportunities, fetchOportunidade } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  const {
    leadNotes,
    noteLoading,
    fetchLeadNotesByLead,
    createNewLeadNote,
  } = useLeadNotes();

  useEffect(() => {
    fetchOportunidade();
  }, []);

  const groupedLeads = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      [LeadStatus.CADASTRADO]: [],
      [LeadStatus.ATENDIMENTO]: [],
      [LeadStatus.AGUARDANDO]: [],
      [LeadStatus.VISITA]: [],
      [LeadStatus.NEGOCIACAO]: [],
      [LeadStatus.VENDA]: [],
      [LeadStatus.ENCERRADO]: [],
    };

    for (const lead of opportunities) {
      grouped[lead.status].push(lead);
    }

    return grouped;
  }, [opportunities]);

  async function handleAddNote() {
    if (!selectedLead || !newNote.trim()) return;

    setSaving(true);

    try {
      const dto: LeadNoteRequest = {
        leadId: selectedLead.id,
        note: newNote.trim(),
      };

      await createNewLeadNote(dto);

      await fetchLeadNotesByLead(selectedLead.id, 0);

      setNewNote("");
    } finally {
      setSaving(false);
    }
  }

  async function handleOpenNotes(lead: Lead) {
    setSelectedLead(lead);
    await fetchLeadNotesByLead(lead.id, 0);
  }

  function handleCloseNotes() {
    setSelectedLead(null);
    setNewNote("");
  }

  return (
    <div className="h-150 flex flex-col">

      <div className="p-4 border-b shrink-0">
        <h1 className="text-xl font-semibold">Oportunidades</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-4 overflow-x-auto p-4">

          {Object.entries(groupedLeads)
            .filter(([status]) =>
              status !== LeadStatus.CADASTRADO &&
              status !== LeadStatus.ENCERRADO
            )
            .map(([status, leads]) => (
              <PipelineColumn
                key={status}
                status={status as LeadStatus}
                leads={leads}
                onOpenNotes={handleOpenNotes}
              />
            ))}

        </div>
      </div>

      <Modal
        open={!!selectedLead}
        title={"Anotações de:"}
        onClose={handleCloseNotes}
        width="w-[600px]"
        height="h-[80vh]"
      >
        {selectedLead && (
          <div className="flex flex-col gap-4 h-full">

            <div>
              <h2 className="text-2xl font-semibold">
                {selectedLead.nome}
              </h2>

              <p className="text-gray-500">
                {selectedLead.email}
              </p>

              <p className="text-gray-500">
                {selectedLead.telefone}
              </p>
            </div>

            <div>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Digite uma anotação..."
                rows={4}
                className="w-full border rounded-lg p-3 resize-none"
              />

              <button
                onClick={handleAddNote}
                disabled={saving}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {saving ? "Salvando..." : "Salvar anotação"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-lg p-3">
              {noteLoading ? (
                <p>Carregando notas...</p>
              ) : leadNotes.length > 0 ? (
                leadNotes.map((note) => (
                  <div
                    key={note.id}
                    className="border-b pb-2 mb-2"
                  >
                    <p>{note.note}</p>

                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt)
                        .toLocaleString("pt-BR")}
                    </span>
                  </div>
                ))
              ) : (
                <p>Nenhuma anotação encontrada.</p>
              )}
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
}