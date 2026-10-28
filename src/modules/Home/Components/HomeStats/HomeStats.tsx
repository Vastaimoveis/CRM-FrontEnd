
import HomeStatCard from "../HomeStatCard/HomeStatCard";
import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { FollowUpStatus } from "@/shared/types/followUpTypes";
import HomeFollowToday from "../HomeFollowToday/HomeFollowToday";

export interface statItem {
    title: string;
    color: string;
    description: string;
}

export default function HomeStats() {
    const { statusCounts } = useFollowUp();
    const countStyles: Record<FollowUpStatus, statItem> = {
        [FollowUpStatus.ATRASADO]: { title: "atrasados", color: "bg-red-500 text-white", description: "Urgente" },
        [FollowUpStatus.PENDENTE]: { title: "Pendentes", color: "bg-amber-400 text-slate-900", description: "Ação pendente" },
        [FollowUpStatus.REAGENDADO]: { title: "Reagendados", color: "bg-slate-500 text-white", description: "Ação reagendada" },
        [FollowUpStatus.CONCLUIDO]: { title: "Concluidos", color: "bg-emerald-600 text-white", description: "Atendimento concluído" },
        [FollowUpStatus.CANCELADO]: {title: "", color: "", description: ""},
    };

    const STATUS_TABS = [
        FollowUpStatus.ATRASADO,
        FollowUpStatus.PENDENTE,
        FollowUpStatus.REAGENDADO,
        FollowUpStatus.CONCLUIDO,
    ];

    function getStatusCount(status: FollowUpStatus): number {
        return statusCounts.find(
            (tab) => tab.status === status
        )?.quantidade ?? 0;
    }

    return (

        <section className="
            grid grid-cols-1 gap-3
            md:grid-cols-2
            lg:grid-cols-5
        ">
            <HomeFollowToday />

            {STATUS_TABS.map((status) => {
                return (
                    <HomeStatCard
                        title={countStyles[status].title}
                        value={getStatusCount(status)}
                        description={countStyles[status].description}
                        variant={countStyles[status].color}
                        key={countStyles[status].title}
                    />
                )
            })}

        </section>

    );
}