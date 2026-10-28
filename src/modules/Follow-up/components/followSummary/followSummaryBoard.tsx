import { CalendarDays, CheckCircle2, ChevronDown, Clock3 } from "lucide-react";
import FollowSummaryCard from "./followSummaryCard";

import {
    FollowUpStatus,
    type FollowUpStatusCount
} from "@/shared/types/followUpTypes";

interface Props {
    statusCounts: FollowUpStatusCount[];
    todayCount: number;
}

export default function FollowSummaryBoard({
    statusCounts,
    todayCount
}: Props) {

    const getCount = (status: FollowUpStatus): number =>
        statusCounts.find(item => item.status === status)?.quantidade ?? 0;

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="font-semibold">
                    Resumo dos seus follow-ups
                </h2>

                <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-2 text-xs"
                >
                    Hoje
                    <ChevronDown size={14} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <FollowSummaryCard
                    icon={<Clock3 size={25} />}
                    value={getCount(FollowUpStatus.ATRASADO)}
                    label="Atrasados"
                    color="red"
                />

                <FollowSummaryCard
                    icon={<CalendarDays size={25} />}
                    value={todayCount}
                    label="Para hoje"
                    color="amber"
                />

                <FollowSummaryCard
                    icon={<CalendarDays size={25} />}
                    value={getCount(FollowUpStatus.PENDENTE)}
                    label="Pendentes"
                    color="blue"
                />

                <FollowSummaryCard
                    icon={<CheckCircle2 size={25} />}
                    value={getCount(FollowUpStatus.CONCLUIDO)}
                    label="Concluídos"
                    color="green"
                />
            </div>
        </section>
    );
}