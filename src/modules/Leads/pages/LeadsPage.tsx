
import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import LeadsPreviewModal from "../components/LeadsPreviewModal";
import LeadsConfirmModal from "../components/LeadsConfirmModal";
import { useLeadNotes } from "@/app/providers/LeadNoteProvider";
import Modal from "@/shared/components/leadNotesModal";
import LeadDatePicker from "../components/LeadsDatePicker";
import LeadEditModal from "../components/LeadsEditModal";
import { useLeadsPage } from "../hooks/useLeadsPage";
import { LeadsReminderPicker } from "../components/LeadsReminderPicker";
import { useLeadReminder } from "../hooks/useLeadReminder";

export default function Leads() {
    const {
        leads,
        filters,
        updateFilters,
        totalPages,
        confirmModal,
        setConfirmModal,
        previewType,
        searchInput,
        setEditingLead,
        setPreviewType,
        editingLead,
        handleClearFilters,
        handleDelete,
        handleEditLead,
        handlePatchStatus,
        handleSearchChanges,
        handleStatusChanges,
    } = useLeadsPage();

    const {
        leadNotes,
        noteLoading,
        addNote, closeNotes,
        newNote, openNotes, saving,
        selectedLead, setNewNote
    } = useLeadNotes();

    const { dateReminder,
        openReminder,
        setOpenReminder,
        onCancel,
        onSave,
        onSelect} = useLeadReminder();


    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Leads</h1>

                    <div className="text-sm text-gray-500">
                        {leads.length} resultado(s)
                    </div>
                </div>
                <div className="flex justify-between">
                    <LeadsFilter
                        status={filters.status ?? ""}
                        search={searchInput}
                        onStatusChange={handleStatusChanges}
                        onSearchChange={handleSearchChanges}
                    />

                    <LeadDatePicker
                        startDate={filters.startDate}
                        endDate={filters.endDate}
                        onChange={(start, end) => {
                            updateFilters({
                                startDate: start,
                                endDate: end,
                                page: 0
                            })
                        }}
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 rounded border text-sm hover:bg-gray-100"
                        >
                            Limpar filtros
                        </button>

                        <button
                            onClick={() => setPreviewType("export")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                        >
                            Exportar Excel
                        </button>
                    </div>

                    {previewType && (
                        <LeadsPreviewModal
                            leads={leads}
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
                leads={leads}
                patchLeadStatus={handlePatchStatus}
                onDelete={handleDelete}
                onEdit={setEditingLead}
                onOpenNotes={openNotes}

            />

            <LeadsPagination
                currentPage={filters.page + 1}
                totalPages={totalPages}
                onPrev={() =>
                    updateFilters({
                        page: Math.max(0, filters.page - 1)
                    })
                }

                onNext={() =>
                    updateFilters({
                        page: filters.page + 1
                    })
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
                                <LeadsReminderPicker leadId={selectedLead.id} date={dateReminder} onCancel={onCancel} open={openReminder} onSave={onSave} onSelect={onSelect} key={"Date picker reminder"} />

                                <div className="flex justify-between">
                                    <button
                                        onClick={addNote}
                                        disabled={saving}
                                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        {saving ? "Salvando..." : "Salvar anotação"}
                                    </button>
                                    <button
                                        onClick={() => setOpenReminder(true)}
                                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
                                    >
                                        Novo lembrete
                                    </button>
                                </div>
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

            {editingLead && <LeadEditModal
                open={!!editingLead}
                lead={editingLead}
                onClose={() => setEditingLead(null)}
                onSave={handleEditLead}
            />}
        </div>
    );
}