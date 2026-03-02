import { type Lead, LeadStatus } from "../../../types/LeadType";
import LeadCard from "./LeadCard";

interface Props {
    status: LeadStatus;
    leads: Lead[];
    onSelectLead: (lead: Lead) => void;
}

export default function PipelineColumn({ status, leads, onSelectLead }: Props) {

    return (
        <div className="min-w-75 h-full bg-gray-100 rounded-lg flex flex-col">

            {/* Header fixo */}
            <div className="p-3 font-semibold border-b bg-white shrink-0">
                {status} ({leads.length})
            </div>

            {/* Área que rola */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {leads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead}
                        onClick={() => onSelectLead(lead)}
                    />
                ))}
            </div>
        </div>
    );
}