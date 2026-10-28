
import type { countStatusResponse } from "@/services/leads/types/leads";
import type { LeadStatus } from "@/shared/types/LeadType";
import { ChartNoAxesColumnIncreasing, ArrowRight } from "lucide-react";

import { Link } from "react-router-dom";

interface Props {
    data: countStatusResponse;
}

const STATUS_COLORS: Record<string, string> = {
    CADASTRADO: "bg-slate-500",
    ATENDIMENTO: "bg-blue-500",
    AGUARDANDO: "bg-amber-500",
    VISITA: "bg-purple-500",
    NEGOCIACAO: "bg-rose-500",
    VENDA: "bg-emerald-500",
    ENCERRADO: "bg-gray-500"
};


export default function HomeFunnel({
    data
}: Props) {
    const chartData = Object.entries(data.porStatus).map(
        ([status, quantidade]) => ({
            status: status as LeadStatus,
            quantidade
        })
    );

    const maxValue = Math.max(
        ...chartData.map(item => item.quantidade),
        1
    );

    const hasData = data.total > 0;


    return (
        <section className="
            w-full rounded-xl border border-slate-200
            bg-white p-5 shadow-sm
        ">

            {/* CABEÇALHO */}

            <header className="
                mb-6 flex items-center
                justify-between gap-3
            ">

                <div className="flex items-center gap-2">

                    <ChartNoAxesColumnIncreasing
                        size={23}
                        className="text-sky-600"
                    />
                    <div className="flex flex-col">

                        <h2 className="text-sm font-semibold text-slate-900">
                            Funil
                        </h2>
                        <p className="text-sm font-semibold text-slate-900">Total de leads: {data.total}</p>
                    </div>
                </div>

                <Link
                    to="/funil"
                    className="
                        flex items-center gap-1
                        text-xs font-medium text-sky-600
                        transition hover:text-sky-700
                    "
                >
                    Ver funil completo
                    <ArrowRight size={15} />
                </Link>

            </header>

            {/* INDICADORES */}

            <div className="flex flex-col gap-4">
                {!hasData ? (
                    <p className="py-6 text-center text-sm text-slate-500">
                        Nenhum Lead encontrado.
                    </p>
                ) : (
                    chartData.map(item => {
                        const percentage =
                            (item.quantidade / maxValue) * 100;

                        const color =
                            STATUS_COLORS[item.status] ?? "bg-slate-400";

                        return (
                            <div
                                key={item.status}
                                className="
                        grid
                        grid-cols-[minmax(95px,120px)_minmax(0,1fr)_32px]
                        items-center gap-3
                    "
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`h-3 w-3 shrink-0 rounded ${color}`}
                                    />

                                    <span className="truncate text-[11px] font-medium text-slate-700">
                                        {item.status}
                                    </span>
                                </div>

                                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${color}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <span className="text-right text-xs font-medium tabular-nums text-slate-700">
                                    {item.quantidade}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>

        </section>
    );
}