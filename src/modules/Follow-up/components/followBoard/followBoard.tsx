import type {
    FollowUp,
    FollowUpStatus,
    FollowUpStatusCount
} from "@/shared/types/followUpTypes";

import FollowFilter, {
    type FollowUpCorretorOption
} from "./FollowFilter/FollowFilter";

import FollowRodape from "./FollowRodape/FollowRodape";
import FollowTable from "./FollowTable/FollowTable";

import type { FollowUpFilters } from "@/shared/types/filterTypes";

import FollowTableSkeleton from "@/shared/components/FollowTableSkeleton/FollowTableSkeleton";

interface Props {
    statusCounts?: FollowUpStatusCount[];
    todayCount: number;
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
    todayCount = 0,
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

    return (
        <section className="
            min-w-0 overflow-hidden
            rounded-xl border border-slate-200 bg-white
        ">

            {/* Filtros */}
            {showFilters && handleFiltersChange && (
                <FollowFilter
                    tabs={statusCounts}
                    todayCount={todayCount}
                    filters={filters}
                    corretores={corretores}
                    onFiltersChange={handleFiltersChange}
                />
            )}

            {/* Tabela / Loading */}
            <div className="w-full overflow-x-auto">

                {loading ? (
                    <FollowTableSkeleton />
                ) : followUps.length > 0 ? (
                    <FollowTable
                        followUps={followUps}
                        showFilters={showFilters}
                        statusStyles={statusStyles}
                        onScheduleNext={onScheduleNext}
                        onReschedule={onReschedule}
                        onCancel={onCancel}
                        loading={loading}
                    />
                ) : (
                    <div className="
                        px-4 py-10 text-center
                        text-sm text-slate-500
                    ">
                        Nenhum follow-up encontrado.
                    </div>
                )}

            </div>

            {/* Rodapé */}
            {showFilters && (
                <FollowRodape
                    page={page}
                    pageSize={pageSize}
                    loading={loading}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    onPageChange={onPageChange}
                />
            )}

        </section>
    );
}