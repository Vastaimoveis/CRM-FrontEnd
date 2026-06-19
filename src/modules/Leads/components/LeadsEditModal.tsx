import { useEffect, useState } from "react";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import type { UpdateLeadDto } from "@/services/leads/types/leads";
import { validatePhone } from "@/shared/utils/validatePhone";
import { formatPhone } from "@/shared/utils/formatPhone";
import { useToast } from "@/app/providers/ToastProvider";

interface Props {
    lead: Lead | null;
    open: boolean;
    loading?: boolean;
    onClose: () => void;
    onSave: (id: string, data: UpdateLeadDto) => Promise<void>;
}

export default function LeadEditModal({
    lead,
    open,
    onClose,
    onSave,
    loading
}: Props) {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        telefone: "",
        status: LeadStatus.CADASTRADO,
    });
    const { showToast } = useToast();

    useEffect(() => {
        if (!lead) return;

        setForm({
            nome: lead.nome,
            email: lead.email,
            telefone: lead.telefone,
            status: lead.status,
        });
    }, [lead]);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!open || !lead) { return null };
        if (form.nome.trim().length < 3) {
            alert("Nome deve possuir pelo menos 3 caracteres");
            return;
        }

        if (form.nome.trim().length < 3) {
            showToast(
                "Nome deve possuir pelo menos 3 caracteres",
                "warning"
            );
            return;
        }

        if (
            form.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ) {
            showToast("Email inválido", "warning")
            return;
        }

        if (!validatePhone(form.telefone)) {
            showToast(
                "Telefone inválido",
                "warning"
            );
            return;
        }

        await onSave(lead.id, form);
        showToast("Lead alterado com sucesso", "success")
        onClose();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

            <div className="bg-white p-6 rounded-xl w-full max-w-lg">

                <h2 className="text-xl font-semibold mb-4">
                    Editar Lead
                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >
                    <input
                        value={form.nome}
                        onChange={(e) =>
                            setForm({ ...form, nome: e.target.value })
                        }
                        className="border rounded-lg p-2"
                    />

                    <input
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                        className="border rounded-lg p-2"
                    />

                    <input
                        value={form.telefone}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                telefone: formatPhone(e.target.value)
                            })}
                        className="border rounded-lg p-2"
                    />

                    <select
                        value={form.status}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                status: e.target.value as LeadStatus,
                            })
                        }
                        className="border rounded-lg p-2"
                    >
                        {Object.values(LeadStatus).map((status) => (
                            <option
                                key={status}
                                value={status}
                            >
                                {status}
                            </option>
                        ))}
                    </select>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="border px-4 py-2 rounded-lg"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black text-white px-4 py-2 rounded-lg"
                        >
                            Salvar
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}