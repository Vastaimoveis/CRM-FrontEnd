
import type {
    FollowUp,
} from "@/shared/types/followUpTypes";

import { MessageCircle } from "lucide-react";

import FollowActionsDropdown from "../FollowActionsDropdown/FollowActionsDropDown";

interface Props {
    followUp: FollowUp;
    showFilters: boolean;


    onReschedule: (followUp: FollowUp) => void;
    onCancel: (followUp: FollowUp) => void;
    onScheduleNext: (followUp: FollowUp) => void;
}

function calcularDiasParaContato(data?: string | null): number | null {

    if (!data) return null;

    const hoje = new Date();
    const contato = new Date(data);

    if (Number.isNaN(contato.getTime())) return null;

    const diaAtual = Date.UTC(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    );

    const diaContato = Date.UTC(
        contato.getFullYear(),
        contato.getMonth(),
        contato.getDate()
    );

    return Math.round(
        (diaContato - diaAtual) / 86400000
    );
}

function formatarData(data?: string | null, incluirHora = false) {

    if (!data) return "—";

    const date = new Date(data);

    if (Number.isNaN(date.getTime())) return "—";

    return incluirHora
        ? date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
        : date.toLocaleDateString("pt-BR");
}

export default function FollowCell({
    followUp,
    showFilters,
    onScheduleNext,
    onReschedule,
    onCancel
}: Props) {

    const diasRestantes = calcularDiasParaContato(
        followUp.proximoContato
    );

    const isAtrasado = diasRestantes !== null && diasRestantes < 0;

    const isHoje = diasRestantes === 0;

    const acaoTexto =
        diasRestantes === null
            ? "Sem agendamento"
            : isAtrasado
                ? `${Math.abs(diasRestantes)} ${
                    Math.abs(diasRestantes) === 1 ? "dia" : "dias"
                } de atraso`
                : isHoje
                    ? "Hoje"
                    : `Faltam ${diasRestantes} ${
                        diasRestantes === 1 ? "dia" : "dias"
                    }`;

    return (
        <tr className="border-b border-slate-100 transition hover:bg-slate-50">

            <td className="whitespace-nowrap px-3 py-4 font-medium">
                {followUp.lead.nome}
            </td>

            <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                {followUp.lead.telefone}
            </td>

            <td className="px-3 py-4">
                <span className="
                    whitespace-nowrap rounded-lg
                    bg-slate-100 px-3 py-1.5
                    text-xs font-semibold text-slate-700
                ">
                    {followUp.lead.status}
                </span>
            </td>

            <td className="whitespace-nowrap px-3 py-4 text-center">
                {followUp.followUpAtual}/{followUp.followUpTotal}
            </td>

            {showFilters && (
                <>
                    <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                        {followUp.ultimoContato
                            ? formatarData(followUp.ultimoContato, true)
                            : "Primeiro contato"}
                    </td>

                    <td className={`whitespace-nowrap px-3 py-4 ${
                        isAtrasado ? "text-red-600" : "text-slate-700"
                    }`}>
                        {formatarData(followUp.proximoContato)}
                    </td>
                </>
            )}

            <td className="px-3 py-4">
                <span className={`
                    inline-flex min-w-25 justify-center
                    whitespace-nowrap rounded-lg
                    px-3 py-2 text-xs font-semibold

                    ${diasRestantes === null
                        ? "bg-slate-100 text-slate-600"
                        : isAtrasado
                            ? "bg-red-100 text-red-700"
                            : isHoje
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                    }
                `}>
                    {acaoTexto}
                </span>
            </td>

            <td className="whitespace-nowrap px-3 py-4">
                <div className="flex items-center justify-end gap-2">

                    <button
                        type="button"
                        onClick={() => onScheduleNext(followUp)}
                        className="
                            flex items-center gap-2
                            whitespace-nowrap rounded-lg
                            bg-black px-3 py-2.5
                            text-xs font-medium text-white
                            transition hover:bg-slate-800
                        "
                    >
                        <MessageCircle size={16} />
                        Fazer follow-up
                    </button>

                    <FollowActionsDropdown
                        onReschedule={() => onReschedule(followUp)}
                        onCancel={() => onCancel(followUp)}
                    />

                </div>
            </td>

        </tr>
    );
}
