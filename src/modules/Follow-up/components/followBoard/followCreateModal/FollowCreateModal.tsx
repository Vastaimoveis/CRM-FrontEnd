import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, X } from "lucide-react";

import type { FollowUp } from "@/shared/types/followUpTypes";

export type FollowModalMode =
    | "next"
    | "reschedule"
    | "cancel";

export interface FollowModalData {
    antigoId: string;
    observacao: string;
    proximoContato?: string;
}

interface Props {
    followUp: FollowUp | null;
    mode: FollowModalMode;
    loading: boolean;
    onClose: () => void;
    onConfirm: (data: FollowModalData) => Promise<void>;
}

const modalConfig = {
    next: {
        title: "Agendar próximo Follow-up",
        description: "Registre a observação do contato realizado.",
        confirm: "Agendar Follow-up",
        loading: "Agendando..."
    },
    reschedule: {
        title: "Reagendar Follow-up",
        description: "Defina uma nova data para entrar em contato.",
        confirm: "Confirmar reagendamento",
        loading: "Reagendando..."
    },
    cancel: {
        title: "Cancelar Follow-up",
        description: "Confirme o cancelamento deste contato.",
        confirm: "Confirmar cancelamento",
        loading: "Cancelando..."
    }
} satisfies Record<
    FollowModalMode,
    {
        title: string;
        description: string;
        confirm: string;
        loading: string;
    }
>;

export default function FollowModal({
    followUp,
    mode,
    loading,
    onClose,
    onConfirm
}: Props) {

    const [observacao, setObservacao] = useState("");
    const [proximoContato, setProximoContato] = useState("");
    const [error, setError] = useState<string | null>(null);

    const config = modalConfig[mode];

    useEffect(() => {

        setObservacao("");
        setProximoContato("");
        setError(null);

    }, [followUp?.id, mode]);

    useEffect(() => {

        if (!followUp) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape" && !loading) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };

    }, [followUp, loading, onClose]);

    if (!followUp) return null;

    async function handleSubmit(
        e: FormEvent<HTMLFormElement>
    ) {

        e.preventDefault();

        if (!followUp || loading) return;

        const texto = observacao.trim();

        if (texto.length < 5) {
            setError("Digite no mínimo 5 caracteres na observação.");
            return;
        }

        if (mode === "reschedule") {

            if (!proximoContato) {
                setError("Informe a nova data do contato.");
                return;
            }

            if (
                !Number.isFinite(new Date(proximoContato).getTime()) ||
                new Date(proximoContato).getTime() <= Date.now()
            ) {
                setError("Selecione uma data e horário futuros.");
                return;
            }
        }

        setError(null);

        try {

            await onConfirm({
                antigoId: followUp.id,
                observacao: texto,
                ...(mode === "reschedule"
                    ? { proximoContato }
                    : {})
            });

        } catch (err) {

            setError(
                err instanceof Error
                    ? err.message
                    : "Não foi possível concluir a operação."
            );
        }
    }

    return (

        <div
            role="presentation"
            className="
                fixed inset-0 z-[100]
                flex items-center justify-center
                bg-black/50 p-4
            "
        >

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="follow-modal-title"
                className="
                    w-full max-w-lg
                    overflow-hidden rounded-xl
                    bg-white shadow-xl
                "
            >

                {/* CABEÇALHO */}

                <div className="
                    flex items-start justify-between
                    border-b border-slate-200 p-5
                ">

                    <div>

                        <h2
                            id="follow-modal-title"
                            className="
                                text-lg font-semibold
                                text-slate-900
                            "
                        >
                            {config.title}
                        </h2>

                        <h3 className="mt-1 text-base text-slate-700">
                            {followUp.lead.nome}
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            {config.description}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Fechar modal"
                        className="
                            rounded-lg p-2
                            text-slate-500 transition
                            hover:bg-slate-100
                            disabled:opacity-50
                        "
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* FORMULÁRIO */}

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5 p-5"
                >

                    {/* AVISO DE CANCELAMENTO */}

                    {mode === "cancel" && (

                        <div className="
                            flex items-start gap-3
                            rounded-lg border border-red-200
                            bg-red-50 p-4
                            text-sm text-red-700
                        ">

                            <AlertTriangle
                                size={19}
                                className="mt-0.5 shrink-0"
                            />

                            <p>
                                Você está prestes a cancelar este
                                Follow-up. Confirme a operação
                                informando o motivo abaixo.
                            </p>

                        </div>

                    )}

                    {/* DATA DO REAGENDAMENTO */}

                    {mode === "reschedule" && (

                        <div>

                            <label
                                htmlFor="follow-date"
                                className="
                                    mb-2 block text-sm
                                    font-medium text-slate-700
                                "
                            >
                                Nova data do contato *
                            </label>

                            <input
                                id="follow-date"
                                type="datetime-local"
                                required
                                value={proximoContato}
                                onChange={(e) =>
                                    setProximoContato(e.target.value)
                                }
                                disabled={loading}
                                className="
                                    w-full rounded-lg
                                    border border-slate-200
                                    p-3 text-sm outline-none
                                    focus:border-sky-500
                                "
                            />

                        </div>

                    )}

                    {/* OBSERVAÇÃO */}

                    <div>

                        <label
                            htmlFor="follow-observation"
                            className="
                                mb-2 block text-sm
                                font-medium text-slate-700
                            "
                        >
                            {mode === "cancel"
                                ? "Motivo do cancelamento *"
                                : "Observação *"}
                        </label>

                        <textarea
                            id="follow-observation"
                            required
                            minLength={5}
                            rows={4}
                            value={observacao}
                            onChange={(e) =>
                                setObservacao(e.target.value)
                            }
                            disabled={loading}
                            placeholder={
                                mode === "cancel"
                                    ? "Informe o motivo do cancelamento..."
                                    : mode === "reschedule"
                                        ? "Informe o motivo do reagendamento..."
                                        : "Descreva o contato realizado..."
                            }
                            className="
                                w-full resize-none rounded-lg
                                border border-slate-200
                                p-3 text-sm outline-none
                                focus:border-sky-500
                            "
                        />

                    </div>

                    {error && (

                        <p
                            role="alert"
                            className="text-sm text-red-600"
                        >
                            {error}
                        </p>

                    )}

                    {/* RODAPÉ */}

                    <div className="
                        flex justify-end gap-3
                        border-t border-slate-100 pt-5
                    ">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                rounded-lg border border-slate-200
                                px-4 py-2.5 text-sm
                                text-slate-600 transition
                                hover:bg-slate-50
                                disabled:opacity-50
                            "
                        >
                            Voltar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                rounded-lg px-4 py-2.5
                                text-sm font-medium text-white
                                transition
                                disabled:cursor-not-allowed
                                disabled:opacity-50

                                ${
                                    mode === "cancel"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-sky-600 hover:bg-sky-700"
                                }
                            `}
                        >
                            {loading
                                ? config.loading
                                : config.confirm}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}