import type { Lead } from "@/shared/types/LeadType";

interface Props {
  lead: Lead;
  onOpenNotes: (lead: Lead) => void;
}

export default function LeadCard({ lead, onOpenNotes }: Props) {
  return (
    <div className="w-full border rounded-lg p-2 bg-white flex place-items-center justify-between">

      <div className="flex flex-col">
        <strong>{lead.nome}</strong>
        <p>{lead.email}</p>
        <p>{lead.telefone}</p>
      </div>

      <button className={`${lead.hasNotes ? "bg-green-700" : "bg-black"}  text-white font-semibold px-3 py-1 rounded-full hover:scale-110 duration-150`}
        onClick={() => onOpenNotes(lead)}>
        {lead.hasNotes ? "Visualizar notas" : "adicionar nota"}
      </button>

    </div>
  );
}