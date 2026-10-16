
import { useCallback, useEffect, useState } from "react";

import FollowAlerta from "../followAlerta";
import FollowSummaryBoard from "../followSummary/followSummaryBoard";
import FollowNextBoard from "../followNexts/followNextsBoard";
import FollowRankingBoard from "../followRanking/followRankingBoard";
import FollowBoard from "../followBoard/followBoard";

import {
    FollowUpStatus,
    type FollowUp
} from "@/shared/types/followUpTypes";

import type { FollowUpFilters } from "@/shared/types/filterTypes";

import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { useUsers } from "@/app/providers/UserProvider";
import { useAuth } from "@/app/providers/AuthProvider";

import { useDebounce } from "../../hooks/useDebounce";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";

import FollowModal, {
    type FollowModalMode,
    type FollowModalData
} from "../followBoard/followCreateModal/FollowCreateModal";

interface ActiveFollowModal {
    followUp: FollowUp;
    mode: FollowModalMode;
}

const PAGE_SIZE = 10;

export default function FollowMainPage() {

    const { user } = useAuth();

    const {
        followUps,
        statusCounts,
        loading,

        page,
        pageSize,
        totalPages,
        totalElements,

        scheduleNext,

        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps,
        fetchStatusCounts
    } = useFollowUp();

    const {
        corretores,
        loadCorretores
    } = useUsers();

    const isManager =
        user?.role.name === SYSTEM_ROLES.ADMIN ||
        user?.role.name === SYSTEM_ROLES.GERENTE;

    const [filters, setFilters] = useState<FollowUpFilters>({
        status: FollowUpStatus.PENDENTE
    });

    const [currentPage, setCurrentPage] = useState(0);

    const debouncedSearch = useDebounce(
        filters.search ?? "",
        400
    );

    const [activeModal, setActiveModal] =
        useState<ActiveFollowModal | null>(null);

    const [modalLoading, setModalLoading] = useState(false);

    // BUSCA CENTRALIZADA

    const refreshFollowUps = useCallback(async () => {

        if (!user) return;

        const requestFilters: FollowUpFilters = {
            ...filters,
            search: debouncedSearch
        };

        if (isManager) {

            await fetchAllFilteredFollowUps(
                requestFilters,
                currentPage,
                PAGE_SIZE
            );

        } else {

            const { userId: _userId, ...myFilters } = requestFilters;
            void _userId;

            await fetchMyFilteredFollowUps(
                myFilters,
                currentPage,
                PAGE_SIZE
            );
        }

    }, [
        user,
        filters,
        debouncedSearch,
        currentPage,
        isManager,
        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps
    ]);

    // BUSCA AUTOMÁTICA

    useEffect(() => {

        if (!user) return;

        if ((filters.search ?? "") !== debouncedSearch) {
            return;
        }

        void refreshFollowUps();

    }, [
        user,
        filters.search,
        debouncedSearch,
        refreshFollowUps
    ]);

    // INDICADORES PESSOAIS

    useEffect(() => {

        if (!user) return;

        void fetchStatusCounts();

    }, [user, fetchStatusCounts]);

    // CORRETORES: SOMENTE PERFIS AUTORIZADOS

    useEffect(() => {

        if (!user || !isManager) return;

        void loadCorretores();

    }, [user, isManager, loadCorretores]);

    // FILTROS

    function handleFiltersChange(newFilters: FollowUpFilters) {

        setCurrentPage(0);
        setFilters(newFilters);
    }

    function handleActiveTab(tab: FollowUpStatus) {

        handleFiltersChange({
            ...filters,
            status: tab
        });
    }

    function handlePageChange(nextPage: number) {

        setCurrentPage(nextPage);
    }

    // MODAL

    function handleOpenNextFollowUp(followUp: FollowUp) {

        setActiveModal({
            followUp,
            mode: "next"
        });
    }

    function handleOpenReschedule(followUp: FollowUp) {

        setActiveModal({
            followUp,
            mode: "reschedule"
        });
    }

    function handleOpenCancel(followUp: FollowUp) {

        setActiveModal({
            followUp,
            mode: "cancel"
        });
    }

    function handleCloseModal() {

        if (modalLoading) return;

        setActiveModal(null);
    }

    // CONFIRMAÇÃO

    async function handleConfirmModal(data: FollowModalData) {

        if (!activeModal || modalLoading) return;

        const { followUp, mode } = activeModal;

        setModalLoading(true);

        try {

            switch (mode) {

                case "next": {

                    await scheduleNext(followUp.id, {
                        antigoId: followUp.id,
                        observacao: data.observacao
                    });

                    break;
                }

                case "reschedule": {

                    if (!data.proximoContato) {
                        throw new Error(
                            "Informe a nova data do contato."
                        );
                    }

                    // PENDENTE:
                    // Converter FollowModalData para o formato real
                    // de RescheduleFollowUpRequest e chamar reschedule().
                    //
                    // Não criar propriedades sem verificar o DTO.

                    throw new Error(
                        "Integração do reagendamento pendente."
                    );
                }

                case "cancel": {

                    // PENDENTE:
                    // Conectar ao serviço de cancelamento quando
                    // a operação estiver implementada no backend.

                    throw new Error(
                        "Cancelamento ainda não implementado."
                    );
                }
            }

            // A operação principal foi concluída.
            setActiveModal(null);

            // Recarrega a tabela e os indicadores.
            await Promise.all([
                refreshFollowUps(),
                fetchStatusCounts()
            ]);

        } finally {

            setModalLoading(false);
        }
    }

    return (

        <main className="
            min-h-screen w-full
            bg-slate-50 p-4
            text-slate-900 sm:p-5
        ">

            <FollowAlerta
                handleActiveTab={handleActiveTab}
                Atrasados={statusCounts}
            />

            <div className="
                grid grid-cols-1 items-start gap-5
                2xl:grid-cols-[minmax(0,1fr)_344px]
            ">

                <FollowBoard
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}

                    onScheduleNext={handleOpenNextFollowUp}
                    onReschedule={handleOpenReschedule}
                    onCancel={handleOpenCancel}

                    statusCounts={statusCounts}
                    corretores={corretores}
                    followUps={followUps}
                    loading={loading}

                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    totalElements={totalElements}

                    onPageChange={handlePageChange}
                />

                <aside className="flex min-w-0 flex-col gap-5">

                    <FollowSummaryBoard />

                    <FollowNextBoard />

                    <FollowRankingBoard />

                </aside>

            </div>

            <FollowModal
                followUp={activeModal?.followUp ?? null}
                mode={activeModal?.mode ?? "next"}
                loading={modalLoading}
                onClose={handleCloseModal}
                onConfirm={handleConfirmModal}
            />

        </main>
    );
}