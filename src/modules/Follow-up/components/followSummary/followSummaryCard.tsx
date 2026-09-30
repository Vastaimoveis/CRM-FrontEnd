
interface SummaryCardProps {
    icon: React.ReactNode;
    value: number;
    label: string;
    color: "red" | "amber" | "blue" | "green";
}

export default function FollowSummaryCard({
    icon,
    value,
    label,
    color,
}: SummaryCardProps) {
    const colors = {
        red: "bg-red-50 text-red-600",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-sky-50 text-sky-600",
        green: "bg-emerald-50 text-emerald-600",
    };

    return (
        <div
            className={`flex min-h-[76px] items-center gap-3 rounded-xl p-3 ${colors[color]}`}
        >
            <div className="shrink-0">{icon}</div>

            <div className="min-w-0">
                <p className="text-xl font-semibold text-slate-900">
                    {value}
                </p>
                <p className="text-xs text-slate-600">{label}</p>
            </div>
        </div>
    );
}