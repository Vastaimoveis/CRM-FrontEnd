import { ArrowUpRight, Info } from "lucide-react";
import type { FollowUp, FollowUpStatus, FollowUpStatusCount } from "@/shared/types/followUpTypes";
import FollowCell from "./FollowCell/FollowCell";
import FollowFilter, { type FollowUpCorretorOption } from "./FollowFilter/FollowFilter";
import FollowRodape from "./FollowRodape/FollowRodape";
import type { FollowUpFilters } from "@/shared/types/filterTypes";
import { useNavigate } from "react-router-dom";

interface Props {
    statusCounts?: FollowUpStatusCount[];

    filters?: FollowUpFilters;

    corretores?: FollowUpCorretorOption[];


    showFilters?: boolean;
    onScheduleNext: (followUp: FollowUp) => void;
    handleFiltersChange?: (filters: FollowUpFilters) => void;

    onReschedule: (followUp: FollowUp) => void;
    onCancel: (followUp: FollowUp) => void;

    followUps: FollowUp[];

    // Paginação
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;

    onPageChange: (page: number) => void;
}
export default function FollowBoard({
    filters = {},
    handleFiltersChange,
    statusCounts = [],
    corretores = [],
    showFilters = true,
    followUps,

    onScheduleNext,
    page,
    pageSize,
    totalPages,
    totalElements,
    loading,
    onPageChange,
    onReschedule,
    onCancel

}: Props) {

    const statusStyles: Record<FollowUpStatus, string> = {
        ATRASADO: "bg-red-600 text-white",
        PENDENTE: "bg-amber-400 text-slate-900",
        REAGENDADO: "bg-slate-500 text-white",
        CONCLUIDO: "bg-emerald-600 text-white",
        CANCELADO: "bg-black text-white"
    };

    const navigate = useNavigate();
    function handleViewAll() {
        navigate("/follow");
    }

    return (
        <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white">

            {/* Abas e filtros */}

            {showFilters && handleFiltersChange && (
                <FollowFilter
                    tabs={statusCounts}
                    filters={filters}
                    corretores={corretores}
                    onFiltersChange={handleFiltersChange}
                />
            )}


            <div className="w-full overflow-x-auto">
                <table className="
        w-full min-w-200
        table-auto border-collapse
        text-left text-sm
    ">

                    <thead className="bg-white">
                        <tr className="border-b border-slate-200 text-slate-700">

                            <th className="px-3 py-5 text-left font-medium">
                                Cliente
                            </th>

                            <th className="px-3 py-5 text-left font-medium">
                                Telefone
                            </th>

                            <th className="px-3 py-5 text-left font-medium">
                                Status
                            </th>

                            <th className="px-3 py-5 text-left font-medium">
                                <span className="flex items-center gap-1">
                                    Follow-up
                                    <Info size={14} className="text-slate-400" />
                                </span>
                            </th>

                            {showFilters && (
                                <>
                                    <th className="px-3 py-5 text-left font-medium">
                                        Último contato
                                    </th>

                                    <th className="px-3 py-5 text-left font-medium">
                                        Próximo contato
                                    </th>
                                </>
                            )}

                            <th className="px-3 py-5 text-left font-medium">
                                Próxima ação
                            </th>

                            <th className="px-3 py-5 text-right font-medium">

                                {showFilters ? (
                                    "Ação"
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleViewAll}
                                        className="
                        inline-flex items-center justify-end gap-1
                        whitespace-nowrap font-semibold text-sky-600
                        transition-colors hover:text-sky-800
                    "
                                    >
                                        Ver todos
                                        <ArrowUpRight size={15} />
                                    </button>
                                )}

                            </th>

                        </tr>
                    </thead>

                    <tbody>
                        {followUps.map((item) => (
                            <FollowCell
                                showFilters={showFilters}
                                followUp={item}
                                statusStyles={statusStyles}
                                key={item.id}
                                onScheduleNext={onScheduleNext}
                                onReschedule={onReschedule}
                                onCancel={onCancel}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Rodapé da tabela */}
            {showFilters &&
                <FollowRodape
                    page={page}
                    pageSize={pageSize}
                    loading={loading}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={onPageChange}
                />
            }
        </section>
    )
}