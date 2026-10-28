import { useCallback, useEffect, useState } from "react";

import { useFollowUp } from "@/app/providers/FollowUpProvider";
import { useAuth } from "@/app/providers/AuthProvider";

import FollowBoard from "@/modules/Follow-up/components/followBoard/followBoard";

import FollowModal from "@/modules/Follow-up/components/followBoard/followCreateModal/FollowCreateModal";

import { useFollowModal } from "@/modules/Follow-up/hooks/useFollowModal";

const PAGE_SIZE = 5;

export default function HomeFollowBoard() {

    const { user } = useAuth();

    const {
        followUps,
        loading,
        page,
        pageSize,
        totalPages,
        totalElements,
        fetchMyFilteredFollowUps,
        fetchStatusCounts
    } = useFollowUp();

    const [currentPage, setCurrentPage] = useState(0);

    // BUSCA

    const refreshFollowUps = useCallback(async () => {

        if (!user) return;

        await fetchMyFilteredFollowUps(
            {},
            currentPage,
            PAGE_SIZE
        );

    }, [
        user,
        currentPage,
        fetchMyFilteredFollowUps
    ]);

    useEffect(() => {

        void refreshFollowUps();

    }, [refreshFollowUps]);

    // PAGINAÇÃO

    function handlePageChange(nextPage: number) {
        setCurrentPage(nextPage);
    }

    // ATUALIZAÇÃO APÓS OPERAÇÕES

    const handleSuccess = useCallback(async () => {

        await Promise.all([
            refreshFollowUps(),
            fetchStatusCounts()
        ]);

    }, [
        refreshFollowUps,
        fetchStatusCounts
    ]);

    // MODAL COMPARTILHADO

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
        <section className="w-full">

            <FollowBoard
                showFilters={false}

                followUps={followUps}
                loading={loading}

                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                totalElements={totalElements}

                onPageChange={handlePageChange}

                onScheduleNext={handleOpenNextFollowUp}
                onReschedule={handleOpenReschedule}
                onCancel={handleOpenCancel}
            />

            <FollowModal
                followUp={activeModal?.followUp ?? null}
                mode={activeModal?.mode ?? "next"}
                loading={modalLoading}
                onClose={handleCloseModal}
                onConfirm={handleConfirmModal}
            />

        </section>
    );
}