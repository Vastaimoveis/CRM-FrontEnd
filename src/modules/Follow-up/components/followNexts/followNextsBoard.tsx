interface Props {
    proximosFollowUps: []
}

const proximosFollowUps = [
    { nome: "Andreia", data: "24/09/2026", prazo: "Em 1 dia" },
    { nome: "Marcos", data: "25/09/2026", prazo: "Em 2 dias" },
    { nome: "Carla", data: "26/09/2026", prazo: "Em 3 dias" },
    { nome: "Paulo", data: "27/09/2026", prazo: "Em 4 dias" },
    { nome: "Renata", data: "28/09/2026", prazo: "Em 5 dias" },
];

export default function FollowNextBoard() {


    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-3 font-semibold">
                Próximos follow-ups
            </h2>

            <div className="divide-y divide-slate-100">
                {proximosFollowUps.map((item) => (
                    <div
                        key={item.nome}
                        className="flex items-center justify-between gap-2 py-3 text-sm"
                    >
                        <span className="truncate font-medium">
                            {item.nome}
                        </span>

                        <span className="whitespace-nowrap text-xs text-slate-500 sm:text-sm">
                            {item.data}
                        </span>

                        <span className="whitespace-nowrap rounded-md bg-sky-100 px-2 py-1 text-xs text-sky-700">
                            {item.prazo}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}