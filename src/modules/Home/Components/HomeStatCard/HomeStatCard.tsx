
interface Props {
    title: string;
    value: number | string;
    description?: string;

    variant?: string;
}


export default function HomeStatCard({
    title,
    value,
    description,
    variant = "white"
}: Props) {

    return (

        <article
            className={`
                flex w-50 items-center 
                rounded-xl border border-white/70
                p-5 shadow-sm
                ${variant}
            `}
        >

            <div className="min-w-0">

                <strong className="block text-3xl font-bold text-slate-950">
                    {value}
                </strong>

                <p className="font-bold text-black">
                    {title}
                </p>

                {description && (
                    <p className="mt-1 text-sm text-slate-950 font-semibold">
                        {description}
                    </p>
                )}

            </div>

        </article>

    );
}