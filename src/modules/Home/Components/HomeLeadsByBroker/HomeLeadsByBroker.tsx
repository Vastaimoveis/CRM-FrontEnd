import type { LeadPorCorretor } from "@/shared/types/LeadType";

interface HomeLeadsByBrokerProps {
    data: LeadPorCorretor[];
    loading?: boolean;
}

export default function HomeLeadsByBroker({
    data,
    loading = false,
}: HomeLeadsByBrokerProps) {

    const totalLeads = data.reduce(
        (total, corretor) => total + corretor.quantidade,
        0
    );

    return (
        <section className="min-w-0 rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                        Leads por corretor
                    </h2>

                    <p className="text-sm text-slate-500">
                        Distribuição de leads no período
                    </p>
                </div>

                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                    {totalLeads} leads
                </span>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-slate-100"
                        />
                    ))}
                </div>
            ) : data.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-500">
                    Nenhum lead encontrado neste período.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-105 text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                                <th className="pb-3 font-medium">
                                    Corretor
                                </th>
                                <th className="pb-3 text-center font-medium">
                                    Leads
                                </th>
                                <th className="pb-3 text-right font-medium">
                                    Participação
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((corretor) => {
                                const participacao = totalLeads > 0
                                    ? (corretor.quantidade / totalLeads) * 100
                                    : 0;

                                return (
                                    <tr
                                        key={corretor.corretorId}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="py-4">
                                            <span className="font-medium text-slate-700">
                                                {corretor.corretorNome}
                                            </span>
                                        </td>

                                        <td className="py-4 text-center font-semibold text-slate-700">
                                            {corretor.quantidade}
                                        </td>

                                        <td className="py-4 text-right">
                                            <span className="text-sm text-slate-600">
                                                {participacao.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}