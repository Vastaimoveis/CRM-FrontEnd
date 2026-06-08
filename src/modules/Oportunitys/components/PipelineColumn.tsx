import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import LeadCard from "./LeadCard";

interface Props {
  status: LeadStatus;
  leads: Lead[];
  onOpenNotes: (lead: Lead) => void;
}

export default function PipelineColumn({
  status,
  leads,
  onOpenNotes,
}: Props) {
  return (
    <div className="min-w-75 h-full bg-gray-100 rounded-lg flex flex-col">

      <div className="p-3 font-semibold border-b bg-white shrink-0">
        {status} ({leads.length})
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onOpenNotes={onOpenNotes}
          />
        ))}
      </div>

    </div>
  );
}