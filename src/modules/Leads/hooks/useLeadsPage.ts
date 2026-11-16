
import { useAuth } from "@/app/providers/Auth/AuthProvider";
import { useLeads } from "@/app/providers/Lead/LeadProvider";
import { useToast } from "@/app/providers/Toast/ToastProvider";
import type { UpdateLeadDto } from "@/services/leads/types/leads";
import { createLeadNote } from "@/services/leadsNote/LeadsNoteService";
import { LeadStatus, type Lead } from "@/shared/types/LeadType";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./useLeadDebounce";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";

export function useLeadsPage() {
    const {
        leads,
        filters,
        updateFilters,
        fetchFilteredLeads,
        patchLeadStatus,
        patchLeadCorretor,
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

    const [sendModal, setSendModal] = useState<Lead | null>(null);

    const { user, loadingAuth } = useAuth();

    // Alteração de status
    const handlePatchStatus = useCallback(async (
        id: string,
        status: LeadStatus
    ) => {
        if (status === LeadStatus.ENCERRADO) {
            setConfirmModal({
                title: "Encerrar Lead",
                message: "Informe o motivo do encerramento do lead.",
                confirmLabel: "Encerrar",
                requireNote: true,

                onConfirm: async (note?: string) => {
                    if (!note?.trim()) {
                        showToast("A anotação é obrigatória", "error");
                        return;
                    }

                    try {
                        showToast("Encerrando lead...", "warning");

                        await createLeadNote({
                            leadId: id,
                            note: note.trim()
                        });

                        const result = await patchLeadStatus(
                            id,
                            LeadStatus.ENCERRADO
                        );

                        if (!result) return;

                        setConfirmModal(null);
                        showToast("Lead encerrado com sucesso", "success");
                    } catch (error) {
                        // createLeadNote não é tratado pelo LeadProvider.
                        console.error("Erro ao encerrar lead:", error);
                        showToast("Erro ao encerrar lead", "error");
                    }
                }
            });

            return;
        }

        showToast("Alterando status...", "warning");

        const result = await patchLeadStatus(id, status);

        if (!result) return;

        showToast("Status alterado com sucesso", "success");
    }, [showToast, patchLeadStatus]);

    // Edição completa
    const handleEditLead = useCallback(async (
        id: string,
        data: UpdateLeadDto
    ): Promise<boolean> => {
        return handleEdit(id, data);
    }, [handleEdit]);

    // Filtro de status
    const handleStatusChanges = useCallback((newStatus: LeadStatus | null) => {
        updateFilters({
            status: newStatus,
            page: 0
        });
    }, [updateFilters]);

    // Busca
    const handleSearchChanges = useCallback((value: string) => {
        setSearchInput(value);
    }, []);

    // Exclusão
    const handleDelete = useCallback((id: string) => {
        setConfirmModal({
            title: "Excluir lead",
            message: "Tem certeza que deseja excluir este lead? Esta ação não poderá ser desfeita.",
            confirmLabel: "Excluir",

            onConfirm: async () => {
                showToast("Deletando lead...", "warning");

                const deleted = await deleteLead(id);

                if (!deleted) return;

                setConfirmModal(null);
                showToast("Lead deletado com sucesso", "success");
            }
        });
    }, [showToast, deleteLead]);

    // Limpar filtros
    const handleClearFilters = useCallback(() => {
        updateFilters({
            search: "",
            status: null,
            startDate: null,
            endDate: null,
            page: 0
        });

        setSearchInput("");
    }, [updateFilters]);

    // Alterar corretor
    const handleSend = useCallback(async (
        leadId: string,
        userId: string
    ) => {
        const result = await patchLeadCorretor(leadId, userId);

        if (!result) return;

        showToast("Corretor alterado com sucesso", "success");
        setSendModal(null);
    }, [patchLeadCorretor, showToast]);

    const openSendModal = useCallback((lead: Lead) => {
        setSendModal(lead);
    }, []);

    // Buscar leads conforme usuário e filtros
    useEffect(() => {
        if (loadingAuth || !user) return;

        fetchFilteredLeads({
            ...filters,
            userId: user.role.name !== SYSTEM_ROLES.CORRETOR
                ? null
                : user.id,
        });
    }, [filters, user, loadingAuth, fetchFilteredLeads]);

    // Debounce da busca
    useEffect(() => {
        if (loadingAuth) return;

        if (debouncedSearch === filters.search) return;

        updateFilters({
            search: debouncedSearch,
            page: 0,
        });
    }, [debouncedSearch, filters.search, loadingAuth, updateFilters]);

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
        openSendModal,

        handlePatchStatus,
        handleClearFilters,
        handleSend,
        handleDelete,
        handleEditLead,
        handleStatusChanges,
        handleSearchChanges,
        setSendModal,
        sendModal,
    };
}
