import { useCallback, useEffect, useRef, useState } from "react";

import FollowSummaryBoard from "../followSummary/followSummaryBoard";
import FollowBoard from "../followBoard/followBoard";

import { FollowUpStatus } from "@/shared/types/followUpTypes";

import type { FollowUpFilters } from "@/shared/types/filterTypes";

import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { useUsers } from "@/app/providers/UserProvider";
import { useAuth } from "@/app/providers/AuthProvider";

import { useDebounce } from "../../hooks/useDebounce";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";

import { useFollowModal } from "../../hooks/useFollowModal";
import FollowModal from "../followBoard/followCreateModal/FollowCreateModal";

const PAGE_SIZE = 10;

export default function FollowMainPage() {

    const { user } = useAuth();

    const {
        followUps,
        statusCounts,
        statusCountsLoaded,
        loading,
        todayCount,

        page,
        pageSize,
        totalPages,
        totalElements,

        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps,
        fetchStatusCounts,
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

    const initialTabResolved = useRef(false);

    const [currentPage, setCurrentPage] = useState(0);

    const debouncedSearch = useDebounce(
        filters.search ?? "",
        400
    );


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
    
    useEffect(() => {

        if (!user) return;

        void fetchStatusCounts();

    }, [user, fetchStatusCounts]);

    // INDICADORES PESSOAIS

    useEffect(() => {

        if (!user?.id || !initialTabResolved.current) return;

        if ((filters.search ?? "") !== debouncedSearch) return;

        void refreshFollowUps();

    }, [
        user?.id,
        filters.search,
        debouncedSearch,
        refreshFollowUps,
        statusCountsLoaded
    ]);
    // CORRETORES: SOMENTE PERFIS AUTORIZADOS

    useEffect(() => {

        if (!user || !isManager) return;

        void loadCorretores();

    }, [user, isManager, loadCorretores]);

    useEffect(() => {

        if (!statusCountsLoaded || initialTabResolved.current) return;

        const hasOverdue = statusCounts.some(
            item =>
                item.status === FollowUpStatus.ATRASADO &&
                item.quantidade > 0
        );

        initialTabResolved.current = true;

        setFilters(prev => ({
            ...prev,
            status: hasOverdue
                ? FollowUpStatus.ATRASADO
                : FollowUpStatus.PENDENTE
        }));

        setCurrentPage(0);

    }, [statusCountsLoaded, statusCounts]);

    // FILTROS

    function handleFiltersChange(newFilters: FollowUpFilters) {

        setCurrentPage(0);
        setFilters(newFilters);
    }

    function handlePageChange(nextPage: number) {

        setCurrentPage(nextPage);
    }


    const handleSuccess = useCallback(async () => {

        await Promise.all([
            refreshFollowUps(),
            fetchStatusCounts()
        ]);

    }, [
        refreshFollowUps,
        fetchStatusCounts
    ]);

    const {
        activeModal,
        modalLoading,

        handleOpenNextFollowUp,
        handleOpenReschedule,
        handleOpenCancel,

        handleCloseModal,
        handleConfirmModal

    } = useFollowModal({
        onSuccess: handleSuccess
    });

    return (

        <main className="
            min-h-screen w-full
            bg-slate-50 
            text-slate-900
        ">
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

                    <FollowSummaryBoard statusCounts={statusCounts} todayCount={todayCount} />


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