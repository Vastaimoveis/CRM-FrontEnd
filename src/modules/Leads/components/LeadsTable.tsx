import { type Lead, LeadStatus } from "@/shared/types/LeadType";
import Permission from "@/shared/permissions/Permission";
import { UserRoles } from "@/shared/types/UserTypes";

interface LeadsTableProps {
    leads: Lead[];
    updateLeadStatus: (id: string, status: LeadStatus) => void;
}

export default function LeadsTable({
    leads,
    updateLeadStatus,
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
                </tr>
            </thead>

            <tbody>
                {leads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{lead.nome}</td>
                        <td>{lead.email}</td>
                        <td>{lead.telefone}</td>

                        <td>
                            <select
                                value={lead.status}
                                onChange={(e) =>
                                    updateLeadStatus(
                                        lead.id,
                                        e.target.value as LeadStatus
                                    )
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
                            <Permission allowed={[UserRoles.GERENTE]}>
                                <button className="bg-red-500 text-white font-bold rounded-2xl p-2">
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