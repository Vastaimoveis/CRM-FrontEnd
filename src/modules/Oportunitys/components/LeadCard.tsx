import { type Lead } from "@/shared/types/LeadType";

interface Props {
  lead: Lead;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: Props) {
  return (
    <div
    onClick={onClick}
    className="w-full h-fit border border-black rounded-lg p-2 bg-white hover:bg-gray-300"
    >
      <strong>{lead.nome}</strong>
      <p>{lead.email}</p>
      <p>{lead.telefone}</p>
    </div>
  );
}