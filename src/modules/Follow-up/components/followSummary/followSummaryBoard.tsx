import { CalendarDays, CheckCircle2, ChevronDown, Clock3 } from "lucide-react"
import FollowSummaryCard from "./followSummaryCard"

export default function FollowSummaryBoard() {



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
                    value={7}
                    label="Atrasados"
                    color="red"
                />

                <FollowSummaryCard
                    icon={<CalendarDays size={25} />}
                    value={12}
                    label="Para hoje"
                    color="amber"
                />

                <FollowSummaryCard
                    icon={<CalendarDays size={25} />}
                    value={18}
                    label="Próximos"
                    color="blue"
                />

                <FollowSummaryCard
                    icon={<CheckCircle2 size={25} />}
                    value={45}
                    label="Concluídos"
                    color="green"
                />
            </div>
        </section>
    )
}