import { useToast } from "@/app/providers/ToastProvider";
import { useHooksFunnel } from "../hooks/useHooksFunnel";
import type { CreateLeadDTO } from "@/shared/types/LeadType";
import { validatePhone } from "@/shared/utils/validatePhone";

interface Props {
  open: boolean;
  onClose: () => void;

  createLead: (data: CreateLeadDTO) => Promise<void>;

  fetchLeads: (page: number) => Promise<void>;
}

export default function LeadModal({ open, onClose, createLead, fetchLeads }: Props) {
  const { showToast } = useToast();

  const {
    form,
    loading,
    setLoading,
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

      await createLead(form);
      resetForm();
      showToast("Lead criado com sucesso", "success");
      await fetchLeads(0);
      onClose();
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

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                onClose()
                resetForm()
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