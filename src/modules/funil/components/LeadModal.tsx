import { useState } from "react";
import { LeadStatus } from "@/shared/types/LeadType";
import { useLeads } from "@/app/providers/LeadProvider";
import { useToast } from "@/app/providers/ToastProvider";

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone: string;
  status: LeadStatus
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLeadDTO) => Promise<void> | void;
}

export default function LeadModal({ open, onClose, onSubmit }: Props) {
  const { createLead } = useLeads();
  const { showToast } = useToast();
  const [form, setForm] = useState<CreateLeadDTO>({
    nome: "",
    email: "",
    telefone: "",
    status: LeadStatus.CADASTRADO,
  });

  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      createLead(form);

      // Reset
      setForm({
        nome: "",
        email: "",
        telefone: "",
        status: LeadStatus.CADASTRADO
      });
      showToast("Lead criado com sucesso", "success")
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
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
            required
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
              onClick={onClose}
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