const ranking = [
    { nome: "Suellen", percentual: 92 },
    { nome: "Fábio", percentual: 68 },
    { nome: "Thaissa", percentual: 41 },
    { nome: "Diana", percentual: 35 },
];

export default function FollowRankingBoard() {
    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Ranking de cumprimento</h2>

                <button
                    type="button"
                    className="text-sm text-sky-700 underline underline-offset-2"
                >
                    Ver todos
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {ranking.map((item, index) => (
                    <div
                        key={item.nome}
                        className="flex items-center gap-3"
                    >
                        <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index === 0
                                ? "bg-amber-300 text-amber-950"
                                : index === 1
                                    ? "bg-slate-300 text-slate-800"
                                    : index === 2
                                        ? "bg-orange-200 text-orange-900"
                                        : "bg-slate-100 text-slate-600"
                                }`}
                        >
                            {index + 1}
                        </span>

                        <span className="w-16 truncate text-sm">
                            {item.nome}
                        </span>

                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                            <div
                                className={`h-full rounded-full ${index === 0
                                    ? "bg-emerald-600"
                                    : index === 1
                                        ? "bg-amber-400"
                                        : "bg-red-500"
                                    }`}
                                style={{ width: `${item.percentual}%` }}
                            />
                        </div>

                        <span className="w-9 text-right text-sm">
                            {item.percentual}%
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}