import { useAuth } from "@/app/providers/AuthProvider";
import { useLeads } from "@/app/providers/LeadProvider";
import { useToast } from "@/app/providers/ToastProvider";
import type { UpdateLeadDto } from "@/services/leads/types/leads";
import { createLeadNote } from "@/services/leadsNote/LeadsNoteService";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { UserRoles } from "@/shared/types/UserTypes";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useLeadDebounce";

export function useLeadsPage() {
    const {
        leads,
        filters,
        updateFilters,
        fetchFilteredLeads,
        patchLeadStatus,
        deleteLead,
        handleEdit,
        totalPages,
    } = useLeads();
    const [previewType, setPreviewType] = useState<"export" | "import" | null>(null);
    const { showToast } = useToast();
    const [searchInput, setSearchInput] = useState(filters.search);
    const debouncedSearch = useDebounce(searchInput, 800);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        title: string;
        message: string;
        confirmLabel: string;
        requireNote?: boolean;
        onConfirm: (note?: string) => void | Promise<void>;
    } | null>(null);

    const { user } = useAuth();

    const handlePatchStatus = useCallback(async (
        id: string,
        status: LeadStatus
    ) => {
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
    }, [showToast, patchLeadStatus])

    const handleEditLead = useCallback(async (
        id: string,
        data: UpdateLeadDto
    ) => {
        await handleEdit(id, data);
    }, [handleEdit, showToast])

    const handleStatusChanges = useCallback((newStatus: LeadStatus | null) => {
        updateFilters(
            {
                status: newStatus,
                page: 0
            }
        )
    }, [updateFilters])

    const handleSearchChanges = useCallback((value: string | "") => {
        setSearchInput(value);
    }, [searchInput])

    const handleDelete = useCallback(async (id: string) => {
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
    }, [showToast, deleteLead]);

    const handleClearFilters = useCallback(() => {
        updateFilters({
            search: "",
            status: null,
            startDate: null,
            endDate: null,
            page: 0
        })
        setSearchInput("")
    }, [updateFilters])

    useEffect(() => {
        if (!user) {
            return;
        }

        fetchFilteredLeads({
            ...filters,
            userId: user.role === UserRoles.GERENTE
                ? null
                : user.id,
        });

    }, [filters, user, fetchFilteredLeads]);

    useEffect(() => {
        if (debouncedSearch === filters.search) return;

        updateFilters({
            search: debouncedSearch,
            page: 0,
        });
    }, [debouncedSearch, filters.search, updateFilters]);

    return {
        leads,
        searchInput,
        editingLead,
        setEditingLead,
        confirmModal,
        setConfirmModal,

        filters,
        updateFilters,
        totalPages,
        previewType,
        setPreviewType,

        handlePatchStatus,
        handleClearFilters,
        handleDelete,
        handleEditLead,
        handleStatusChanges,
        handleSearchChanges,

    };
}