import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";

import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import LeadsPreviewModal from "../components/LeadsPreviewModal";
import { useEffect, useState } from "react";
import LeadsConfirmModal from "../components/LeadsConfirmModal";
import { useToast } from "@/app/providers/ToastProvider";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import Modal from "@/shared/components/leadNotesModal";
import { useAuth } from "@/app/providers/AuthProvider";
import { UserRoles } from "@/shared/types/UserTypes";
import { createLeadNote } from "@/services/leadsNote/LeadsNoteService";

export default function Leads() {
    const {
        leads,
        loading,
        fetchFilteredLeads,
        patchLeadStatus,
        deleteLead,
        totalPages, } = useLeads();

    const {
        leadNotes,
        noteLoading,
        addNote, closeNotes,
        newNote, openNotes, saving,
        selectedLead, setNewNote
    } = useLeadNotes();
    const [previewType, setPreviewType] = useState<"export" | "import" | null>(null);
    const [status, setStatus] = useState<LeadStatus | null>(null);
    const [search, setSearch] = useState("");
    const { showToast } = useToast();
    const [page, setPage] = useState<number>(0);
    const { user } = useAuth();

    const [confirmModal, setConfirmModal] = useState<{
        title: string;
        message: string;
        confirmLabel: string;
        requireNote?: boolean;
        onConfirm: (note?: string) => void | Promise<void>;
    } | null>(null);

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        const userId =
            user?.role === UserRoles.GERENTE
                ? null
                : user?.id ?? null;
        fetchFilteredLeads(
            debouncedSearch,
            status ?? null,
            userId,
            page
        );

    }, [debouncedSearch, status, page]);



    async function handlePatchStatus(
        id: string,
        status: LeadStatus
    ) {
        try {
            if (status === LeadStatus.ENCERRADO) {

                setConfirmModal({
                    title: "Encerrar Lead",
                    message:
                        "Informe o motivo do encerramento do lead.",
                    confirmLabel: "Encerrar",
                    requireNote: true,
                    onConfirm: async (note?: string) => {
                        if (!note?.trim()) {
                            showToast(
                                "A anotação é obrigatória",
                                "error"
                            );
                            return;
                        }
                        showToast(
                            "Encerrando lead...",
                            "warning"
                        );
                        await createLeadNote({
                            leadId: id,
                            note: note.trim()
                        });
                        await patchLeadStatus(
                            id,
                            LeadStatus.ENCERRADO
                        );
                        setConfirmModal(null);
                        showToast(
                            "Lead encerrado com sucesso",
                            "success"
                        );
                    }
                });
                return;
            }
            showToast(
                "Alterando status...",
                "warning"
            );
            await patchLeadStatus(id, status);
            showToast(
                "Status alterado com sucesso",
                "success"
            );
        } catch {
            showToast(
                "Erro ao alterar status",
                "error"
            );
        }
    }

    function handleStatusChanges(newStatus: LeadStatus | null) {
        setStatus(newStatus);
        setPage(0);
    }

    function handleSearchChanges(value: string | "") {
        setSearch(value);
        setPage(0);
    }



    const filteredLeads = leads;

    async function handleDelete(id: string) {
        try {

            setConfirmModal({
                title: "Excluir lead",
                message: "Tem certeza que deseja excluir este lead? Esta ação não poderá ser desfeita.",
                confirmLabel: "Excluir",
                onConfirm: async () => {
                    showToast("Deletando lead", "warning")
                    await deleteLead(id);
                    setConfirmModal(null);
                    showToast("Lead deletado com sucesso", "success")
                }
            })
        } catch {
            showToast("Erro ao deletar lead", "error")
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Carregando leads...
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Leads</h1>

                    <div className="text-sm text-gray-500">
                        {filteredLeads.length} resultado(s)
                    </div>
                </div>
                <div className="flex justify-between">
                    <LeadsFilter
                        status={status ? status : ""}
                        search={search}
                        onStatusChange={(value) => handleStatusChanges(value)}
                        onSearchChange={(value) => handleSearchChanges(value)}
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPreviewType("export")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                        >
                            Exportar Excel
                        </button>
                    </div>

                    {previewType && (
                        <LeadsPreviewModal
                            leads={filteredLeads}
                            title={
                                "Pré-visualização do Export"

                            }
                            confirmLabel={

                                "Exportar Excel"

                            }
                            onConfirm={() => {
                                exportLeadsToExcel(leads)
                            }
                            }
                            onCancel={() => setPreviewType(null)}
                        />
                    )}

                </div>

            </div>

            <LeadsTable
                leads={filteredLeads}
                patchLeadStatus={handlePatchStatus}
                onDelete={handleDelete}
                onOpenNotes={openNotes}

            />

            <LeadsPagination
                currentPage={page + 1}
                totalPages={totalPages}
                onPrev={() =>
                    setPage((p) => Math.max(0, p - 1))}

                onNext={() =>
                    setPage((p) => p + 1)
                }
            />

            {
                confirmModal && (
                    <LeadsConfirmModal
                        title={confirmModal.title}
                        message={confirmModal.message}
                        confirmLabel={confirmModal.confirmLabel}
                        requireNote={confirmModal.requireNote}
                        onConfirm={confirmModal.onConfirm}
                        onCancel={() => setConfirmModal(null)}
                    />
                )
            }

            {selectedLead &&
                <Modal
                    open={!!selectedLead}
                    title={"Anotações de:"}
                    onClose={closeNotes}
                    width="w-[600px]"
                    height="h-[80vh]"
                >
                    {selectedLead && (
                        <div className="flex flex-col gap-4 h-full">

                            <div>
                                <h2 className="text-2xl font-semibold">
                                    {selectedLead.nome}
                                </h2>

                                <p className="text-gray-500">
                                    {selectedLead.email}
                                </p>

                                <p className="text-gray-500">
                                    {selectedLead.telefone}
                                </p>
                            </div>

                            <div>
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Digite uma anotação..."
                                    rows={4}
                                    className="w-full border rounded-lg p-3 resize-none"
                                />

                                <button
                                    onClick={addNote}
                                    disabled={saving}
                                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                                >
                                    {saving ? "Salvando..." : "Salvar anotação"}
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto border rounded-lg p-3">
                                {noteLoading ? (
                                    <p>Carregando notas...</p>
                                ) : leadNotes.length > 0 ? (
                                    leadNotes.map((note) => (
                                        <div
                                            key={note.id}
                                            className="border-b pb-2 mb-2"
                                        >
                                            <p>{note.note}</p>

                                            <span className="text-xs text-gray-500">
                                                {new Date(note.createdAt)
                                                    .toLocaleString("pt-BR")}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhuma anotação encontrada.</p>
                                )}
                            </div>

                        </div>
                    )}
                </Modal>}
        </div>
    );
}