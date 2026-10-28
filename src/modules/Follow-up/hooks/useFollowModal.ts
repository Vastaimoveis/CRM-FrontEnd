import { useCallback, useState } from "react";

import { useFollowUp } from "@/app/providers/FollowUpProvider";

import type { FollowUp } from "@/shared/types/followUpTypes";

import type {
    FollowModalMode,
    FollowModalData
} from "../components/followBoard/followCreateModal/FollowCreateModal";

interface ActiveFollowModal {
    followUp: FollowUp;
    mode: FollowModalMode;
}

interface UseFollowModalProps {
    onSuccess?: () => Promise<void> | void;
}

export function useFollowModal({
    onSuccess
}: UseFollowModalProps = {}) {

    const {
        scheduleNext,
        reschedule,
        cancel
    } = useFollowUp();

    const [activeModal, setActiveModal] =
        useState<ActiveFollowModal | null>(null);

    const [modalLoading, setModalLoading] = useState(false);

    // ABERTURA DOS MODAIS

    const handleOpenNextFollowUp = useCallback(
        (followUp: FollowUp) => {

            setActiveModal({
                followUp,
                mode: "next"
            });

        },
        []
    );

    const handleOpenReschedule = useCallback(
        (followUp: FollowUp) => {

            setActiveModal({
                followUp,
                mode: "reschedule"
            });

        },
        []
    );

    const handleOpenCancel = useCallback(
        (followUp: FollowUp) => {

            setActiveModal({
                followUp,
                mode: "cancel"
            });

        },
        []
    );

    // FECHAMENTO

    const handleCloseModal = useCallback(() => {

        if (modalLoading) return;

        setActiveModal(null);

    }, [modalLoading]);

    // CONFIRMAÇÃO

    const handleConfirmModal = useCallback(
        async (data: FollowModalData) => {

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

                        await reschedule({
                            id: followUp.id,
                            proximoContato: data.proximoContato,
                            observacao: data.observacao?.trim() || null
                        });

                        break;
                    }



                    case "cancel": {
                        await cancel(followUp.id);
                        break;
                    }
                }

                setActiveModal(null);

                await onSuccess?.();

            } finally {

                setModalLoading(false);

            }

        },
        [
            activeModal,
            modalLoading,
            scheduleNext,
            onSuccess
        ]
    );

    return {

        activeModal,
        modalLoading,

        handleOpenNextFollowUp,
        handleOpenReschedule,
        handleOpenCancel,

        handleCloseModal,
        handleConfirmModal

    };
}