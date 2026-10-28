import type { ReactNode } from "react";

interface Props {
    title: string;
    icon?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export default function HomeCard({
    title,
    icon,
    action,
    children,
    className = ""
}: Props) {

    return (

        <section
            className={`
                min-w-0 rounded-xl
                border border-slate-100
                bg-white p-5 shadow-sm
                ${className}
            `}
        >

            <header className="
                mb-5 flex items-center
                justify-between gap-3
            ">

                <div className="flex items-center gap-3">

                    {icon && (
                        <span className="text-sky-600">
                           
                        </span>
                    )}

                    <h2 className="text-base font-semibold text-slate-900">
                        {title}
                    </h2>

                </div>

                {action}

            </header>

            {children}

        </section>

    );
}