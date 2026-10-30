import { PermissionName } from "@/services/permission/permissionTypes";
import { Can } from "@/shared/components/Can";
import type { FollowUpFilters } from "@/shared/types/filterTypes";

import {
    FollowUpStatus,
    type FollowUpStatusCount
} from "@/shared/types/followUpTypes";

import { CalendarDays, ChevronDown, Search } from "lucide-react";

export interface FollowUpCorretorOption {
    id: string;
    nome: string;
}

interface Props {
    tabs: FollowUpStatusCount[];
    filters: FollowUpFilters;
    corretores: FollowUpCorretorOption[];

    onFiltersChange: (filters: FollowUpFilters) => void;
}

const countStyles: Record<FollowUpStatus, string> = {
    [FollowUpStatus.ATRASADO]: "bg-red-600 text-white",
    [FollowUpStatus.PENDENTE]: "bg-amber-400 text-slate-900",
    [FollowUpStatus.REAGENDADO]: "bg-slate-500 text-white",
    [FollowUpStatus.CONCLUIDO]: "bg-emerald-600 text-white",
    [FollowUpStatus.CANCELADO]: ""
};

const STATUS_TABS = [
    FollowUpStatus.ATRASADO,
    FollowUpStatus.PENDENTE,
    FollowUpStatus.REAGENDADO,
    FollowUpStatus.CONCLUIDO,
];

export default function FollowFilter({
    tabs,
    filters,
    corretores,
    onFiltersChange
}: Props) {

    function updateFilter<K extends keyof FollowUpFilters>(
        key: K,
        value: FollowUpFilters[K]
    ) {
        onFiltersChange({
            ...filters,
            [key]: value
        });
    }

    function getStatusCount(status: FollowUpStatus): number {
        return tabs.find(
            (tab) => tab.status === status
        )?.quantidade ?? 0;
    }

    return (
        <div className="
            flex flex-col gap-4
            border-b border-slate-200
            p-3 sm:p-4
        ">

            {/* ABAS DE STATUS */}

            <div className="grid grid-cols-2 gap-1 sm:flex sm:flex-wrap">

                <button
                    type="button"
                    onClick={() => updateFilter("status", null)}
                    className={`
                        flex items-center justify-center
                        rounded-lg border-b-2
                        px-3 py-3 text-sm transition
                        sm:px-4

                        ${!filters.status
                            ? "border-red-600 bg-red-50 text-red-700"
                            : "border-transparent text-slate-600 hover:bg-slate-50"
                        }
                    `}
                >
                    Todos
                </button>

                {STATUS_TABS.map((status) => {

                    const active = filters.status === status;

                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => updateFilter("status", status)}
                            className={`
                                flex items-center justify-center gap-2
                                rounded-lg border-b-2
                                px-3 py-3 text-sm transition
                                sm:px-4

                                ${active
                                    ? "border-red-600 bg-red-50 text-red-700"
                                    : "border-transparent text-slate-600 hover:bg-slate-50"
                                }
                            `}
                        >
                            <span>{status == FollowUpStatus.PENDENTE? "ATUALIZADO" : status}</span>

                            <span
                                className={`
                                    rounded-full px-2 py-0.5
                                    text-xs font-semibold
                                    ${countStyles[status]}
                                `}
                            >
                                {getStatusCount(status)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* FILTROS ADICIONAIS */}

            <div className="
                flex flex-col gap-3
                xl:flex-row xl:items-center
                xl:justify-between
            ">

                {/* PESQUISA */}

                <label className="
                    flex w-full items-center gap-2
                    rounded-lg border border-slate-200
                    bg-white px-3
                    focus-within:border-sky-500
                    xl:max-w-xs
                ">
                    <Search size={18} className="shrink-0 text-slate-500" />

                    <input
                        type="text"
                        value={filters.search ?? ""}
                        onChange={(e) =>
                            updateFilter("search", e.target.value)
                        }
                        placeholder="Buscar lead..."
                        className="
                            w-full bg-transparent
                            py-3 text-sm outline-none
                        "
                    />
                </label>

                <div className="flex flex-col gap-2 sm:flex-row">

                    {/* CORRETOR */}

                    <Can permission={PermissionName.FOLLOWUP_VIEW_USERS}>

                        <label className="relative flex min-w-0 items-center">

                            <span className="sr-only">
                                Filtrar corretor
                            </span>

                            <select
                                value={filters.userId ?? ""}
                                onChange={(e) =>
                                    updateFilter(
                                        "userId",
                                        e.target.value || null
                                    )
                                }
                                className="
                                    w-full appearance-none
                                    rounded-lg border border-slate-200
                                    bg-white py-3 pl-3 pr-9
                                    text-sm outline-none
                                    focus:border-sky-500
                                    sm:w-48
                                "
                            >
                                <option value="">
                                    Todos os corretores
                                </option>

                                {corretores.map((corretor) => (
                                    <option
                                        key={corretor.id}
                                        value={corretor.id}
                                    >
                                        {corretor.nome}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute right-3
                                    text-slate-500
                                "
                            />

                        </label>

                    </Can>

                    {/* DATA INICIAL */}

                    <label className="
                        flex items-center gap-2
                        rounded-lg border border-slate-200
                        bg-white px-3
                        focus-within:border-sky-500
                    ">

                        <CalendarDays
                            size={18}
                            className="shrink-0 text-slate-500"
                        />

                        <input
                            type="date"
                            aria-label="Data inicial"
                            value={filters.startDate ?? ""}
                            max={filters.endDate ?? undefined}
                            onChange={(e) =>
                                updateFilter(
                                    "startDate",
                                    e.target.value || null
                                )
                            }
                            className="
                                min-w-0 bg-transparent
                                py-3 text-sm outline-none
                            "
                        />

                    </label>

                    {/* DATA FINAL */}

                    <label className="
                        flex items-center gap-2
                        rounded-lg border border-slate-200
                        bg-white px-3
                        focus-within:border-sky-500
                    ">

                        <CalendarDays
                            size={18}
                            className="shrink-0 text-slate-500"
                        />

                        <input
                            type="date"
                            aria-label="Data final"
                            value={filters.endDate ?? ""}
                            min={filters.startDate ?? undefined}
                            onChange={(e) =>
                                updateFilter(
                                    "endDate",
                                    e.target.value || null
                                )
                            }
                            className="
                                min-w-0 bg-transparent
                                py-3 text-sm outline-none
                            "
                        />

                    </label>

                    {/* LIMPAR FILTROS */}

                    <button
                        type="button"
                        onClick={() => onFiltersChange({
                            status: FollowUpStatus.PENDENTE
                        })}
                        className="
                            rounded-lg border border-slate-200
                            px-4 py-3 text-sm
                            text-slate-600 transition
                            hover:bg-slate-50
                        "
                    >
                        Limpar filtros
                    </button>

                </div>
            </div>
        </div>
    );
}