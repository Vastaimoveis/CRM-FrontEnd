import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { useMemo, useState } from "react";
import PipelineColumn from "../components/PipelineColumn";
import LeadsNotesModal from "@/modules/Leads/components/LeadsNotesModal";

export default function OportunidadesPage() {
  const { leads } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

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

    for (const lead of leads) {
      grouped[lead.status].push(lead);
    }

    return grouped;
  }, [leads]);

  function handleOpenNotes(lead: Lead) {
    setSelectedLead(lead);
  }

  function handleCloseNotes() {
    setSelectedLead(null);
  }

  return (
    <div className="h-150 flex flex-col">

      <div className="p-4 border-b shrink-0">
        <h1 className="text-xl font-semibold">Oportunidades</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-4 overflow-x-auto p-4">

          {Object.entries(groupedLeads).map(([status, leads]) => (
            <PipelineColumn
              key={status}
              status={status as LeadStatus}
              leads={leads}
              onOpenNotes={handleOpenNotes}
            />
          ))}

        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50">

          <div className="bg-white rounded-xl p-4 w-600px h-80vh ">
            <p className="text-xl mb-4">{selectedLead.nome}</p>
            <LeadsNotesModal
              leadId={selectedLead.id}
              hasNotes={selectedLead.hasNotes}
            />

            <button
              className="mt-4 text-white bg-red-600 p-2 rounded-2xl"
              onClick={handleCloseNotes}
            >
              Fechar
            </button>

          </div>

        </div>
      )}

    </div>
  );
}