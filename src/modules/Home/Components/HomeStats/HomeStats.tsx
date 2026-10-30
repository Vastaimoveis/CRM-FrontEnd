
import HomeStatCard from "../HomeStatCard/HomeStatCard";
import HomeFollowToday from "../HomeFollowToday/HomeFollowToday";

import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { FollowUpStatus } from "@/shared/types/followUpTypes";

export interface statItem {
    title: string;
    color: string;
    description: string;
}

export default function HomeStats() {

    const {
        statusCounts,
        todayCount
    } = useFollowUp();

    const countStyles: Record<FollowUpStatus, statItem> = {
        [FollowUpStatus.ATRASADO]: {
            title: "Atrasados",
            color: "bg-red-500 text-white",
            description: "Urgente"
        },

        [FollowUpStatus.PENDENTE]: {
            title: "Futuros",
            color: "bg-amber-400 text-slate-900",
            description: "Ação pendente"
        },

        [FollowUpStatus.REAGENDADO]: {
            title: "Reagendados",
            color: "bg-slate-500 text-white",
            description: "Ação reagendada"
        },

        [FollowUpStatus.CONCLUIDO]: {
            title: "Concluídos",
            color: "bg-emerald-600 text-white",
            description: "Atendimento concluído"
        },

        [FollowUpStatus.CANCELADO]: {
            title: "",
            color: "",
            description: ""
        }
    };

    const STATUS_TABS = [
        FollowUpStatus.ATRASADO,
        FollowUpStatus.PENDENTE,
        FollowUpStatus.REAGENDADO,
        FollowUpStatus.CONCLUIDO
    ];

    function getStatusCount(status: FollowUpStatus): number {

        const quantidade = statusCounts.find(
            tab => tab.status === status
        )?.quantidade ?? 0;

        // Remove os Follow-ups de hoje da contagem de futuros.
        if (status === FollowUpStatus.PENDENTE) {
            return Math.max(0, quantidade - todayCount);
        }

        return quantidade;
    }

    return (
        <section
            className="
                grid grid-cols-1 gap-3
                md:grid-cols-2
                lg:grid-cols-5
            "
        >
            <HomeFollowToday />

            {STATUS_TABS.map(status => (
                <HomeStatCard
                    key={status}
                    title={countStyles[status].title}
                    value={getStatusCount(status)}
                    description={countStyles[status].description}
                    variant={countStyles[status].color}
                />
            ))}

        </section>
    );
}
