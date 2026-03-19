import type { Lead } from "@/shared/types/LeadType";

interface Props {
    leads: Lead[];
}

export default function LeadsPreviewTable({ leads }: Props) {
    if (!leads.length) {
        return <p className="text-center text-gray-500">Nenhum lead encontrado</p>;
    }

    return (
        <div className="max-h-96 overflow-auto border rounded-lg">
            <table className="w-full text-sm">
                <thead className="bg-gray-100 sticky top-0">
                    <tr>
                        <th className="p-2 text-left">Nome</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Telefone</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Criação</th>
                    </tr>
                </thead>

                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.id} className="border-t">
                            <td className="p-2">{lead.nome}</td>
                            <td className="p-2">{lead.email}</td>
                            <td className="p-2">{lead.telefone}</td>
                            <td className="p-2">{lead.status}</td>
                            <td className="p-2">
                                {new Date(lead.creationDate).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}