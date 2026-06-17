import { useToast } from "@/app/providers/ToastProvider";
import { useHooksFunnel } from "../hooks/useHooksFunnel";
import { LeadStatus, type CreateLeadDTO, type Lead } from "@/shared/types/LeadType";
import { validatePhone } from "@/shared/utils/validatePhone";
import capitalizeWords from "@/shared/utils/capitalizeWords";
import { useState } from "react";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";

interface Props {
  open: boolean;
  onClose: () => void;

  createLead: (data: CreateLeadDTO) => Promise<Lead>;
}

export default function LeadModal({ open, onClose, createLead }: Props) {
  const { showToast } = useToast();
  const [note, setNote] = useState<string>("");
  const { createNewLeadNote } = useLeadNotes();
  const {
    form,
    setForm,
    loading,
    setLoading,
    handleStatusChange,
    handleChange,
    resetForm
  } = useHooksFunnel();

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validatePhone(form.telefone)) {
        showToast("Telefone inválido", "error");
        return;
      }

      setForm(prev => ({
        ...prev,
        nome: capitalizeWords(prev.nome)
      }))

      const createdLead = await createLead(form);

      if (note.trim()) {
        await createNewLeadNote({
          leadId: createdLead.id,
          note: note.trim(),
        });
      }
      resetForm();
      setNote("");
      onClose();
      showToast("Lead criado com sucesso", "success");
    } catch {
      showToast("Erro ao criar lead", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => {
          onClose()
          resetForm()
        }}
      />

      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-6">
          Novo Lead
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}

            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <textarea
            placeholder="Anotação inicial (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />

          <select className="border-2 p-2" onChange={(e) => handleStatusChange(e.target.value as LeadStatus)} >
            {Object.values(LeadStatus)
              .filter((status) => status !== LeadStatus.ENCERRADO)
              .map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                onClose()
                resetForm()
                setNote("")
              }}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-80 transition disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}