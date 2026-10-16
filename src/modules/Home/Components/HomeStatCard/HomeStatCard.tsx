import type { ReactNode } from "react";

interface Props {
    title: string;
    value: number | string;
    description?: string;

    icon: ReactNode;

    variant?: "red" | "yellow" | "blue" | "green" | "purple" | "white";
}

const variants = {
    red: "bg-red-50 text-red-600",
    yellow: "bg-amber-50 text-amber-600",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    white: "bg-white text-blue-700"
};

export default function HomeStatCard({
    title,
    value,
    description,
    icon,
    variant = "white"
}: Props) {

    return (

        <article
            className={`
                flex min-w-0 items-center gap-4
                rounded-xl border border-white/70
                p-5 shadow-sm
                ${variants[variant]}
            `}
        >

            <div className="shrink-0">
                {icon}
            </div>

            <div className="min-w-0">

                <strong className="block text-3xl font-bold text-slate-950">
                    {value}
                </strong>

                <p className="text-sm font-medium text-slate-900">
                    {title}
                </p>

                {description && (
                    <p className="mt-1 text-xs text-slate-500">
                        {description}
                    </p>
                )}

            </div>

        </article>

    );
}