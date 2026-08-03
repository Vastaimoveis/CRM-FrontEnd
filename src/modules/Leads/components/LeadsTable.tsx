import { type Lead, LeadStatus } from "@/shared/types/LeadType";
import { memo } from "react";
import capitalizeWords from "@/shared/utils/capitalizeWords";
import { Trash2, SquarePen, Send } from "lucide-react";
import { PermissionName } from "@/services/permission/permissionTypes";
import { Can } from "@/shared/components/Can";

interface LeadsTableProps {
    leads: Lead[];
    onOpenNotes: ((lead: Lead) => void) | undefined;

    patchLeadStatus: ((id: string, status: LeadStatus) => void) | undefined;
    onSend: ((lead: Lead) => void) | undefined;
    onDelete: ((id: string) => Promise<void>) | undefined;
    onEdit: ((lead: Lead) => void) | undefined;
}

function LeadsTable({
    leads,
    onOpenNotes,
    patchLeadStatus,
    onSend,
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
                                    patchLeadStatus ?
                                        patchLeadStatus(
                                            lead.id,
                                            value
                                        ) : null
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
                                onClick={() =>
                                    onOpenNotes ?
                                        onOpenNotes(lead) : null}
                            >
                                {lead.hasNotes ? "Visualizar notas" : "adicionar nota"}
                            </button>
                        </td>
                        <td>
                            {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="flex justify-center py-2">
                            <button
                                onClick={() =>
                                    onEdit ?
                                        onEdit(lead) : null}
                                className="p-2 rounded-lg hover:bg-blue-100 transition"
                                title="Editar Lead"
                            >
                                <SquarePen size={18}
                                    className="text-blue-600" />
                            </button>

                            <Can permission={PermissionName.LEAD_ASSIGN}>
                                <div className="flex ">
                                    <button onClick={() => {
                                        onSend ?
                                            onSend(lead) : null
                                    }}
                                        className="p-2 rounded-lg hover:bg-green-100 transition">
                                        <Send size={18} className="text-green-800" />
                                    </button>


                                    <button
                                        onClick={() => {
                                            onDelete ?
                                                onDelete(lead.id) : null
                                        }}
                                        className="p-2 rounded-lg hover:bg-red-100 transition"
                                        title="Excluir Lead"
                                    >
                                        <Trash2 size={18}
                                            className="text-red-600" />
                                    </button>
                                </div>
                            </Can>
                        </td>
                    </tr>
                ))}

            </tbody>
        </table>
    );
}

export default memo(LeadsTable);