import { FollowUpStatus, type FollowUpStatusCount } from "@/shared/types/followUpTypes";
import { AlertCircle, X } from "lucide-react";
import { useState } from "react";

interface Props {
    handleActiveTab: (tab: FollowUpStatus) => void;
    Atrasados: FollowUpStatusCount[];
}

export default function FollowAlerta({ handleActiveTab, Atrasados }: Props) {
    const [showAlert, setShowAlert] = useState(true);

    const quantidadeAtrasados = Atrasados.find(
        (count) => count.status === FollowUpStatus.ATRASADO
    )?.quantidade ?? 0;

    const possuiAtrasados = quantidadeAtrasados > 0;

    if (!showAlert || !possuiAtrasados) {
        return null;
    }

    return (
        <section className="mb-5 flex items-center gap-4 rounded-xl border border-red-100 bg-red-50 px-5 py-5 sm:px-7">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white sm:flex">
                <AlertCircle size={29} />
            </div>

            <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold sm:text-xl">
                    Você possui {quantidadeAtrasados} follow-ups atrasados.
                </h2>

                <p className="mt-1 text-sm text-slate-600 sm:text-base">
                    Existem clientes aguardando seu acompanhamento.
                    Mantenha sua carteira atualizada para aumentar
                    suas chances de venda.
                </p>
            </div>

            <button
                type="button"
                onClick={() => handleActiveTab(FollowUpStatus.ATRASADO)}
                className="hidden shrink-0 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 lg:block"
            >
                Ver follow-ups atrasados
            </button>

            <button
                type="button"
                onClick={() => setShowAlert(false)}
                aria-label="Fechar alerta"
                className="self-start text-slate-500 transition hover:text-slate-900"
            >
                <X size={21} />
            </button>
        </section>
    );
}