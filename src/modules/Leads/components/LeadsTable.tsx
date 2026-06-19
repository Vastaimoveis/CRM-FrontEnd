import { type Lead, LeadStatus } from "@/shared/types/LeadType";
import Permission from "@/shared/permissions/Permission";
import { UserRoles } from "@/shared/types/UserTypes";
import { memo } from "react";
import capitalizeWords from "@/shared/utils/capitalizeWords";
import { Trash2, SquarePen } from "lucide-react";

interface LeadsTableProps {
    leads: Lead[];
    onOpenNotes: (lead: Lead) => void;

    patchLeadStatus: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => Promise<void>;
      onEdit: (lead: Lead) => void;

}

function LeadsTable({
    leads,
    onOpenNotes,
    patchLeadStatus,
    onEdit,
    onDelete
}: LeadsTableProps) {


    if (!leads.length) {
        return (
            <div className="text-center py-6 text-gray-400">
                Nenhum lead encontrado.
            </div>
        );
    }





    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="text-left border-b">
                    <th className="py-3">Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Status</th>
                    <th>Anotação</th>
                    <th>Data de Criação</th>
                </tr>
            </thead>

            <tbody>
                {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{capitalizeWords(lead.nome)}</td>
                        <td>{lead.email ? lead.email : "Sem email"}</td>
                        <td>{lead.telefone}</td>

                        <td>
                            <select
                                value={lead.status}
                                onChange={(e) => {
                                    const value = e.target.value as LeadStatus;
                                    patchLeadStatus(
                                        lead.id,
                                        value
                                    )
                                }
                                }
                                className="border rounded-md px-2 py-1"
                            >
                                {Object.values(LeadStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </td>
                        <td>

                            <button
                                className={`${lead.hasNotes ? "bg-green-700" : "bg-black"}  text-white font-semibold px-3 py-2 rounded-full`}
                                onClick={() => onOpenNotes(lead)}
                            >
                                {lead.hasNotes ? "Visualizar notas" : "adicionar nota"}
                            </button>
                        </td>
                        <td>
                            {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                            <Permission allowed={[UserRoles.GERENTE]}>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onEdit(lead)}
                                        className="p-2 rounded-lg hover:bg-blue-100 transition"
                                        title="Editar Lead"
                                    >
                                        <SquarePen size={18}
                                            className="text-blue-600" />
                                    </button>

                                    <button
                                        onClick={() => onDelete(lead.id)}
                                        className="p-2 rounded-lg hover:bg-red-100 transition"
                                        title="Excluir Lead"
                                    >
                                        <Trash2 size={18}
                                            className="text-red-600" />
                                    </button>
                                </div>
                            </Permission>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    );
}

export default memo(LeadsTable);