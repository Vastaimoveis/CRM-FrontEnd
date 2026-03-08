import { useMemo, useState } from "react";
import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import PipelineColumn from "../components/PipelineColumn";
import LeadDocumentsModal from "../components/LeadDocumentsModal";


const PIPELINE_STATUS: LeadStatus[] = [

  LeadStatus.ATENDIMENTO,
  LeadStatus.AGUARDANDO,
  LeadStatus.VISITA,
  LeadStatus.NEGOCIACAO,
  LeadStatus.VENDA,
];


export default function OportunidadesPage() {
  const { leads } = useLeads(); // seu hook compartilhado
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const groupedLeads = useMemo(() => {
    const grouped: Record<LeadStatus, Lead[]> = {
      [LeadStatus.CADASTRADO]: [],
      [LeadStatus.ATENDIMENTO]: [],
      [LeadStatus.AGUARDANDO]: [],
      [LeadStatus.VISITA]: [],
      [LeadStatus.NEGOCIACAO]: [],
      [LeadStatus.VENDA]: [],
    }

    for (const lead of leads) {
      grouped[lead.status].push(lead);
    }
    return grouped;
  }, [leads]);
  return (
    <div className="h-150 flex flex-col">

      {/* Header */}
      <div className="p-4 border-b shrink-0">
        <h1 className="text-xl font-semibold">Oportunidades</h1>
      </div>

      {/* Pipeline */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-4 overflow-x-auto p-4">
          {PIPELINE_STATUS.map((status) => (
            <PipelineColumn
              key={status}
              status={status}
              leads={groupedLeads[status]}
              onSelectLead={setSelectedLead}
            />
          ))}
        </div>
      </div>

      {selectedLead && (
        <LeadDocumentsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}

    </div>
  );
}