
import { useEffect, useState, type FormEvent } from "react";

import { useToast } from "@/app/providers/ToastProvider";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import { useRole } from "@/app/providers/RoleProvider";
import { useUsers } from "@/app/providers/UserProvider";

import { useHooksFunnel } from "../hooks/useHooksFunnel";

import {
  LeadStatus,
  type CreateLeadDTO,
  type Lead
} from "@/shared/types/LeadType";

import { PermissionName } from "@/services/permission/permissionTypes";
import { Can } from "@/shared/components/Can";

import { validatePhone } from "@/shared/utils/validatePhone";
import capitalizeWords from "@/shared/utils/capitalizeWords";

interface Props {
  open: boolean;
  onClose: () => void;
  createLead: (data: CreateLeadDTO) => Promise<Lead>;
}

export default function LeadModal({
  open,
  onClose,
  createLead
}: Props) {

  const { showToast } = useToast();
  const { createNewLeadNote } = useLeadNotes();

  const { hasPermission } = useRole();
  const { corretores, loadCorretores } = useUsers();

  const {
    form,
    loading,
    setLoading,
    handleStatusChange,
    handleChange,
    resetForm
  } = useHooksFunnel();

  const [note, setNote] = useState("");
  const [selectedCorretorId, setSelectedCorretorId] = useState("");

  const canAssignLead = hasPermission(PermissionName.LEAD_ASSIGN);

  function handleClose() {
    if (loading) return;

    resetForm();
    setNote("");
    setSelectedCorretorId("");

    onClose();
  }


  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    if (!validatePhone(form.telefone)) {
      showToast("Telefone inválido", "error");
      return;
    }

    setLoading(true);

    try {
      const payload: CreateLeadDTO = {
        nome: capitalizeWords(form.nome),
        email: form.email.trim(),
        telefone: form.telefone,
        status: form.status,
        origem: form.origem,

        ...(canAssignLead && selectedCorretorId
          ? { userId: selectedCorretorId }
          : {})
      };

      const createdLead = await createLead(payload);

      // A criação do Lead já foi concluída.
      // Uma falha na anotação não deve sugerir que o Lead não foi criado.
      if (note.trim()) {
        try {
          await createNewLeadNote({
            leadId: createdLead.id,
            note: note.trim()
          });
        } catch (error) {
          console.error("Erro ao criar anotação:", error);

          showToast(
            "Lead criado, mas não foi possível salvar a anotação.",
            "error"
          );
        }
      }

      resetForm();
      setNote("");
      setSelectedCorretorId("");

      onClose();

      showToast("Lead criado com sucesso", "success");

    } catch (error) {
      console.error("Erro ao criar Lead:", error);

      showToast("Erro ao criar Lead", "error");

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (!open || !canAssignLead) return;

    async function load() {
      try {
        await loadCorretores();
      } catch (error) {
        console.error(
          "[LeadModal] Erro ao carregar corretores:",
          error
        );
      }
    }

    void load();

  }, [open, canAssignLead, loadCorretores]);


  // Todos os Hooks devem ser executados antes deste retorno
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* BACKDROP */}

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* MODAL */}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-lead-title"
        className="
          relative w-full max-w-md
          max-h-[90vh] overflow-y-auto
          rounded-2xl bg-white p-6
          shadow-xl animate-fadeIn
          sm:p-4
        "
      >

        <h2
          id="create-lead-title"
          className=" text-xl font-semibold"
        >
          Novo Lead
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2"
        >

          {/* NOME */}

          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={form.nome}
            onChange={handleChange}
            disabled={loading}
            required
            className="
              rounded-lg border px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-black
            "
          />

          {/* EMAIL */}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            className="
              rounded-lg border px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-black
            "
          />

          {/* TELEFONE */}

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={handleChange}
            disabled={loading}
            required
            className="
              rounded-lg border px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-black
            "
          />

          {/* ANOTAÇÃO INICIAL */}

          <textarea
            placeholder="Anotação inicial (opcional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={loading}
            rows={4}
            className="
              resize-none rounded-lg border px-4 py-2
              focus:outline-none focus:ring-2 focus:ring-black
            "
          />

          {/* STATUS */}

          <div className="flex flex-col gap-2">

            <label className="text-sm font-medium text-slate-700">
              Status inicial
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                handleStatusChange(e.target.value as LeadStatus)
              }
              disabled={loading}
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-black
              "
            >
              {Object.values(LeadStatus)
                .filter(status => status !== LeadStatus.ENCERRADO)
                .map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
            </select>

          </div>

          {/* ATRIBUIÇÃO DE CORRETOR */}

          <Can permission={PermissionName.LEAD_ASSIGN}>

            <div className="flex flex-col gap-2">

              <label
                htmlFor="lead-corretor"
                className="text-sm font-medium text-slate-700"
              >
                Atribuir a um corretor
              </label>

              <select
                id="lead-corretor"
                value={selectedCorretorId}
                onChange={(e) => setSelectedCorretorId(e.target.value)}
                disabled={loading}
                className="
                          w-full rounded-lg border border-slate-300
                          bg-white px-4 py-2
                          focus:outline-none focus:ring-2 focus:ring-black
                        "
              >
                <option value="">Atribuição padrão</option>

                {corretores.map(corretor => (
                  <option key={corretor.id} value={corretor.id}>
                    {corretor.nome}
                  </option>
                ))}
              </select>

              {corretores.length === 0 && (
                <p className="text-xs text-slate-500">
                  Nenhum corretor disponível para atribuição.
                </p>
              )}

            </div>

          </Can>

          {/* AÇÕES */}

          <div className="mt-4 flex justify-end gap-3">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                rounded-lg border px-4 py-2
                transition hover:bg-gray-100
                disabled:opacity-50
              "
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-lg bg-black px-5 py-2
                text-white transition hover:opacity-80
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
