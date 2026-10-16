import {
    Clock3,
    CalendarDays,
    CalendarClock,
    CircleCheck,
    Users,
    Target
} from "lucide-react";
import HomeStatCard from "../HomeStatCard/HomeStatCard";

export default function HomeStats() {

    return (

        <section className="
            grid grid-cols-1 gap-3
            sm:grid-cols-2
            lg:grid-cols-3
            2xl:grid-cols-6
        ">

            <HomeStatCard
                title="Atrasados"
                value="—"
                description="Precisa de ação"
                icon={<Clock3 size={35} />}
                variant="red"
            />

            <HomeStatCard
                title="Para hoje"
                value="—"
                description="Follow-ups vencem hoje"
                icon={<CalendarDays size={35} />}
                variant="yellow"
            />

            <HomeStatCard
                title="Próximos"
                value="—"
                description="Até 7 dias"
                icon={<CalendarClock size={35} />}
                variant="blue"
            />

            <HomeStatCard
                title="Concluídos"
                value="—"
                description="No período"
                icon={<CircleCheck size={35} />}
                variant="green"
            />

            <HomeStatCard
                title="Leads ativos"
                value="—"
                description="Na sua carteira"
                icon={<Users size={35} />}
                variant="purple"
            />

            <HomeStatCard
                title="Vendas no mês"
                value="—"
                description="Resultado mensal"
                icon={<Target size={35} />}
                variant="white"
            />

        </section>

    );
}