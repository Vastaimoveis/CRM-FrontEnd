import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { FollowUpStatus } from "@/shared/types/followUpTypes";
import { AlertCircle } from "lucide-react";

interface Props {
    onViewOverdue: () => void;
}

export default function AlertaAtrasados({
    onViewOverdue
}: Props) {


    const { statusCounts } = useFollowUp();

    const quantidadeAtrasados = (statusCounts ?? []).find(
    count => count.status === FollowUpStatus.ATRASADO
)?.quantidade ?? 0;

    const possuiAtrasados = quantidadeAtrasados > 0;

    return (
        <section className={`mb-5 flex items-center gap-4 rounded-xl
                border
                ${possuiAtrasados ?
                "border-red-100 bg-red-100" : "border-green-700 bg-green-100"}
                px-5
                py-5
                sm: px - 7
                w-3/5
                place-self-end`}>
            <div className={`
                h - 12
                w - 12
                shrink - 0
                items - center
                justify - center
                rounded - full
                ${possuiAtrasados
                    ?
                    "bg-red-600"
                    :
                    "hidden"}
                    text - white
                    sm: flex`}>
                <AlertCircle size={29} />
            </div>

            <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold sm:text-xl">
                    {possuiAtrasados ? `${quantidadeAtrasados} follow-ups atrasados.` : "Nenhum follow-up atrasado!"}
                </h2>

                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    {quantidadeAtrasados ? "Existem clientes aguardando seu acompanhamento!" : "Nenhum cliente atrasado no momento!"}
                </p>
            </div>

            <button
                type="button"
                onClick={onViewOverdue}
                className={`hidden shrink-0 rounded-lg ${possuiAtrasados ? "bg-red-600 hover:bg-red-700" : "bg-green-500 hover:bg-green-900"} px-5 py-3 text-sm font-semibold text-white transition  lg:block`}
            >
                {possuiAtrasados ? "Ver follow-ups atrasados" : "Ver todos os follow-ups"}
            </button>

            

        </section>
    );
}