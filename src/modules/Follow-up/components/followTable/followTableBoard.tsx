import { CalendarDays, ChevronDown, EllipsisVertical, Info, MessageCircle } from "lucide-react";
import { FollowUpTab, statusStyles, type followUpLead, type typeTabs } from "../../hooks/types";

interface Props {
    selectedCorretor: string;
    handleSelectedCorretor: (nome: string) => void; 
    activeTab: FollowUpTab;
    handleActiveTab: (FollowUpTab: FollowUpTab) => void;
    tabs: typeTabs[];
    selectedRows: string[];
    followUps: followUpLead[];
    toggleRow: (row: string) => void;
    toggleAllRows: () => void;
}

export default function FollowTableBoard({selectedCorretor, handleSelectedCorretor, activeTab, handleActiveTab, tabs, followUps, selectedRows, toggleRow, toggleAllRows }: Props) {


    return (
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">

            {/* Abas e filtros */}
            <div className="flex flex-col gap-4 border-b border-slate-200 p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between">

                <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id;

                        const countStyles: Record<FollowUpTab, string> = {
                            atrasados: "bg-red-600 text-white",
                            hoje: "bg-amber-400 text-slate-900",
                            proximos: "bg-slate-500 text-white",
                            concluidos: "bg-emerald-600 text-white",
                        };

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => handleActiveTab(tab.id)}
                                className={`flex items-center justify-center gap-2 rounded-lg border-b-2 px-3 py-3 text-sm transition sm:px-4 ${active
                                    ? "border-red-600 bg-red-50 text-red-700"
                                    : "border-transparent text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span>{tab.label}</span>

                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${countStyles[tab.id]}`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="relative flex min-w-0 items-center">
                        <span className="sr-only">Filtrar corretor</span>
                        <select
                            value={selectedCorretor}
                            onChange={(e) =>
                                handleSelectedCorretor(e.target.value)
                            }
                            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-3 pl-3 pr-9 text-sm outline-none focus:border-sky-500 sm:w-48"
                        >
                            <option value="todos">Todos os corretores</option>
                            <option value="fabio">Fábio</option>
                            <option value="suellen">Suellen</option>
                            <option value="thaissa">Thaissa</option>
                        </select>

                        <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 text-slate-500"
                        />
                    </label>

                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-3 text-sm transition hover:bg-slate-50"
                    >
                        <CalendarDays size={18} className="text-slate-500" />
                        <span>01/09/2026 - 30/09/2026</span>
                        <ChevronDown size={15} className="text-slate-500" />
                    </button>
                </div>
            </div>
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">

                    <thead className="bg-white">
                        <tr className="border-b border-slate-200 text-slate-700">
                            <th className="px-4 py-5">
                                <input
                                    type="checkbox"
                                    checked={
                                        selectedRows.length === followUps.length
                                    }
                                    onChange={toggleAllRows}
                                    aria-label="Selecionar todos os follow-ups"
                                    className="h-4 w-4 accent-red-600"
                                />
                            </th>

                            <th className="px-3 py-5 font-medium">Cliente</th>
                            <th className="px-3 py-5 font-medium">Telefone</th>
                            <th className="px-3 py-5 font-medium">Status</th>

                            <th className="px-3 py-5 font-medium">
                                <span className="flex items-center gap-1">
                                    Follow-up
                                    <Info size={14} className="text-slate-400" />
                                </span>
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Último contato
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Próximo contato
                            </th>

                            <th className="px-3 py-5 font-medium">
                                Dias em atraso
                            </th>

                            <th className="px-3 py-5 font-medium">Ação</th>
                        </tr>
                    </thead>

                    <tbody>
                        {followUps.map((item) => (
                            <tr
                                key={item.id}
                                className={`border-b border-slate-100 transition hover:bg-slate-50 ${item.id === "1" ? "bg-red-50/80" : ""
                                    }`}
                            >
                                <td className="px-4 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => toggleRow(item.id)}
                                        aria-label={`Selecionar ${item.cliente}`}
                                        className="h-4 w-4 accent-red-600"
                                    />
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 font-medium">
                                    {item.cliente}
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                                    {item.telefone}
                                </td>

                                <td className="px-3 py-4">
                                    <span
                                        className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${statusStyles[item.status] ??
                                            "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-center">
                                    {item.etapa}
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                                    <span className="block">
                                        {item.ultimoContato.split(" ")[0]}
                                    </span>
                                    <span className="mt-1 block text-xs">
                                        {item.ultimoContato.split(" ")[1]}
                                    </span>
                                </td>

                                <td
                                    className={`whitespace-nowrap px-3 py-4 ${item.diasAtraso > 0
                                        ? "text-red-600"
                                        : "text-slate-700"
                                        }`}
                                >
                                    {item.proximoContato}
                                </td>

                                <td className="px-3 py-4">
                                    <span
                                        className={`inline-flex min-w-[72px] justify-center rounded-lg px-3 py-2 font-semibold ${item.diasAtraso > 0
                                            ? "bg-red-100 text-red-700"
                                            : "bg-amber-100 text-amber-700"
                                            }`}
                                    >
                                        {item.diasAtraso > 0
                                            ? `${item.diasAtraso} dias`
                                            : "Hoje"}
                                    </span>
                                </td>

                                <td className="px-3 py-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-black px-3 py-2.5 text-xs font-medium text-white transition hover:bg-slate-800"
                                        >
                                            <MessageCircle size={16} />
                                            Fazer follow-up
                                        </button>

                                        <button
                                            type="button"
                                            aria-label={`Mais opções para ${item.cliente}`}
                                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                                        >
                                            <EllipsisVertical size={19} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Rodapé da tabela */}
            <div className="flex flex-col gap-3 p-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                    {selectedRows.length > 0
                        ? `${selectedRows.length} selecionados`
                        : "Exibindo 10 follow-ups"}
                </span>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        disabled
                        className="rounded-lg border border-slate-200 px-3 py-2 disabled:opacity-40"
                    >
                        Anterior
                    </button>

                    <button
                        type="button"
                        className="rounded-lg bg-red-600 px-3 py-2 text-white"
                    >
                        1
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2"
                    >
                        2
                    </button>

                    <button
                        type="button"
                        className="rounded-lg border border-slate-200 px-3 py-2"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </section>
    )
}