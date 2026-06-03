import { type Lead, LeadStatus } from "@/shared/types/LeadType";
import Permission from "@/shared/permissions/Permission";
import { UserRoles } from "@/shared/types/UserTypes";
import LeadsNotesModal from "./LeadsNotesModal";

interface LeadsTableProps {
    leads: Lead[];

    patchLeadStatus: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => Promise<void>;
}

export default function LeadsTable({
    leads,

    patchLeadStatus,
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
                    <th>Última alteração</th>
                </tr>
            </thead>

            <tbody>
                {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{lead.nome}</td>
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
                        <LeadsNotesModal leadId={lead.id} hasNotes={lead.hasNotes} />
                        <td>
                            {lead.updatedAt == null ? new Date(lead.createdAt).toLocaleDateString() : new Date(lead.updatedAt).toLocaleDateString()}
                        </td>
                        <td>
                            <Permission allowed={[UserRoles.GERENTE]}>
                                <button className="bg-red-500 hover:bg-red-800 text-white font-bold rounded-2xl p-2"
                                    onClick={() => onDelete(lead.id)}>
                                    Excluir Lead
                                </button>
                            </Permission>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}