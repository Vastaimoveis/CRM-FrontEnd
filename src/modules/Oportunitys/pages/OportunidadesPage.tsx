import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { useEffect, useMemo } from "react";
import PipelineColumn from "../components/PipelineColumn";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import Modal from "@/shared/components/leadNotesModal";

export default function OportunidadesPage() {
  const { opportunities, fetchOportunidade } = useLeads();

  const {
    leadNotes,
    noteLoading,
    addNote,
    closeNotes,
    newNote,
    setNewNote,
    openNotes,
    saving,
    selectedLead,

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
                onOpenNotes={openNotes}
              />
            ))}

        </div>
      </div>

      <Modal
        open={!!selectedLead}
        title={"Anotações de:"}
        onClose={closeNotes}
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
                onClick={addNote}
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