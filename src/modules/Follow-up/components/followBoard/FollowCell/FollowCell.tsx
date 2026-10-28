import type { FollowUp, FollowUpStatus } from "@/shared/types/followUpTypes"
import { MessageCircle } from "lucide-react";
import FollowActionsDropdown from "../FollowActionsDropdown/FollowActionsDropDown";

interface Props {
    followUp: FollowUp;
    showFilters: boolean;
    statusStyles: Record<FollowUpStatus, string>;
    onReschedule: (followUp: FollowUp) => void;
    onCancel: (followUp: FollowUp) => void;
    onScheduleNext: (followUp: FollowUp) => void;
}

function calcularDiasParaContato(data: string): number {
    const hoje = new Date();
    const dataContato = new Date(data);

    hoje.setHours(0, 0, 0, 0);
    dataContato.setHours(0, 0, 0, 0);

    return Math.ceil(
        (dataContato.getTime() - hoje.getTime()) /
        (1000 * 60 * 60 * 24)
    );
}

export default function FollowCell({ followUp, showFilters, statusStyles, onScheduleNext, onReschedule, onCancel }: Props) {

    const diasRestantes = calcularDiasParaContato(
        followUp.proximoContato
    );

    return (
        <tr
            key={followUp.id}
            className={`border-b border-slate-100 transition hover:bg-slate-50 
                                    ${followUp.id}`
            }
        >

            <td className="whitespace-nowrap px-3 py-4 font-medium">
                {followUp.lead.nome}
            </td>

            <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                {followUp.lead.telefone}
            </td>

            <td className="px-3 py-4">
                <span
                    className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${statusStyles[followUp.status] ??
                        "bg-slate-100 text-slate-600"
                        }`}
                >
                    {followUp.lead.status}
                </span>
            </td>

            <td className="whitespace-nowrap px-3 py-4 text-center">
                {followUp.followUpAtual}/{followUp.followUpTotal}
            </td>

            {showFilters &&
                <td className="whitespace-nowrap px-3 py-4 text-slate-600">
                    <span className="block">
                        {followUp.ultimoContato
                            ? new Date(followUp.ultimoContato).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "Primeiro Contato"}
                    </span>
                    <span className="mt-1 block text-xs">
                        {followUp.ultimoContato?.split(" ")[1]}
                    </span>
                </td>
            }
            {showFilters &&
                <td
                    className={`whitespace-nowrap px-3 py-4 ${followUp.diasEmAtraso > 0
                        ? "text-red-600"
                        : "text-slate-700"
                        }`}
                >
                    {new Date(followUp.proximoContato).toLocaleDateString("pt-BR")}
                </td>
            }

            <td className="px-3 py-4">

                <span
                    className={`inline-flex min-w-25 justify-center rounded-lg px-3 py-2 font-semibold ${diasRestantes < 0
                        ? "bg-red-100 text-red-700"
                        : diasRestantes === 0
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                >
                    {diasRestantes < 0
                        ? `${Math.abs(diasRestantes)} ${Math.abs(diasRestantes) === 1 ? "dia" : "dias"} de atraso`
                        : diasRestantes === 0
                            ? "Hoje"
                            : `Faltam ${diasRestantes} ${diasRestantes === 1 ? "dia" : "dias"}`}
                </span>
            </td>

            <td className="px-3 py-4">
                <div className="flex followUps-center gap-2">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">

                            <button
                                type="button"
                                onClick={() => onScheduleNext(followUp)}
                                className="flex followUps-center gap-2 whitespace-nowrap rounded-lg bg-black px-3 py-2.5 text-xs font-medium text-white transition hover:bg-slate-800"
                            >
                                <MessageCircle size={16} />
                                Fazer follow-up
                            </button>

                            <FollowActionsDropdown
                                onReschedule={() => onReschedule(followUp)}
                                onCancel={() => onCancel(followUp)}
                            />

                        </div>
                    </div>
                </div>
            </td>
        </tr>
    )
}