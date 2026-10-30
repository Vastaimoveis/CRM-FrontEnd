
import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import FollowSummaryBoard from "../followSummary/followSummaryBoard";
import FollowBoard from "../followBoard/followBoard";

import type { FollowUpFilters } from "@/shared/types/filterTypes";

import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { useUsers } from "@/app/providers/UserProvider";
import { useAuth } from "@/app/providers/AuthProvider";

import { useDebounce } from "../../hooks/useDebounce";
import { SYSTEM_ROLES } from "@/services/roles/roleTypes";

import { useFollowModal } from "../../hooks/useFollowModal";
import FollowModal from "../followBoard/followCreateModal/FollowCreateModal";

import {
    buildFollowUpTabFilters,
    getInitialFollowUpTab
} from "../../hooks/followUpTabFilter";

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
        fetchStatusCounts
    } = useFollowUp();

    const {
        corretores,
        loadCorretores
    } = useUsers();

    const isManager =
        user?.role.name === SYSTEM_ROLES.ADMIN ||
        user?.role.name === SYSTEM_ROLES.GERENTE;

    // Inicialmente não definimos um status.
    // A seleção será realizada após carregar os indicadores.
    const [filters, setFilters] = useState<FollowUpFilters>({});

    const [currentPage, setCurrentPage] = useState(0);

    const [initialFilterReady, setInitialFilterReady] = useState(false);

    // Impede que a seleção automática seja repetida.
    const initialFilterApplied = useRef(false);

    const debouncedSearch = useDebounce(
        filters.search ?? "",
        400
    );

    // 1. CARREGAR INDICADORES

    useEffect(() => {

        if (!user?.id) return;

        void fetchStatusCounts();

    }, [user?.id, fetchStatusCounts]);

    // 2. DEFINIR ABA INICIAL

    useEffect(() => {

        if (!statusCountsLoaded) return;
        if (initialFilterApplied.current) return;

        const initialTab = getInitialFollowUpTab(
            statusCounts,
            todayCount
        );

        setFilters(
            buildFollowUpTabFilters(initialTab)
        );

        setCurrentPage(0);

        initialFilterApplied.current = true;
        setInitialFilterReady(true);

    }, [
        statusCountsLoaded,
        statusCounts,
        todayCount
    ]);

    // 3. BUSCA CENTRALIZADA

    const refreshFollowUps = useCallback(async () => {

        if (!user?.id || !initialFilterApplied.current) return;

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

            const {
                userId: _userId,
                ...myFilters
            } = requestFilters;

            void _userId;

            await fetchMyFilteredFollowUps(
                myFilters,
                currentPage,
                PAGE_SIZE
            );
        }

    }, [
        user?.id,
        isManager,
        filters,
        debouncedSearch,
        currentPage,
        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps
    ]);

    // 4. BUSCA AUTOMÁTICA

    useEffect(() => {

        if (!initialFilterReady) return;
        if (!user?.id) return;

        // Aguarda o debounce antes de buscar.
        if ((filters.search ?? "") !== debouncedSearch) {
            return;
        }

        void refreshFollowUps();

    }, [
        initialFilterReady,
        user?.id,
        filters.search,
        debouncedSearch,
        refreshFollowUps
    ]);

    // 5. CARREGAR CORRETORES

    useEffect(() => {

        if (!user?.id || !isManager) return;

        void loadCorretores();

    }, [
        user?.id,
        isManager,
        loadCorretores
    ]);

    // 6. ALTERAÇÃO DOS FILTROS

    const handleFiltersChange = (
        nextFilters: FollowUpFilters
    ) => {

        setFilters(nextFilters);

        // Toda alteração de filtro retorna para a primeira página.
        setCurrentPage(0);
    };

    // 7. PAGINAÇÃO

    function handlePageChange(nextPage: number) {
        setCurrentPage(nextPage);
    }

    // 8. ATUALIZAÇÃO APÓS AÇÕES NO MODAL

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

        <main
            className="
                min-h-screen w-full
                bg-slate-50
                text-slate-900
            "
        >

            <div
                className="
                    grid grid-cols-1 items-start gap-5
                    2xl:grid-cols-[minmax(0,1fr)_344px]
                "
            >

                <FollowBoard
                    filters={filters}
                    handleFiltersChange={handleFiltersChange}

                    onScheduleNext={handleOpenNextFollowUp}
                    onReschedule={handleOpenReschedule}
                    onCancel={handleOpenCancel}

                    statusCounts={statusCounts}
                    todayCount={todayCount}

                    corretores={corretores}
                    followUps={followUps}

                    loading={loading || !initialFilterReady}

                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    totalElements={totalElements}

                    onPageChange={handlePageChange}
                />

                <aside className="flex min-w-0 flex-col gap-5">

                    <FollowSummaryBoard
                        statusCounts={statusCounts}
                        todayCount={todayCount}
                    />

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
