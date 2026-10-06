import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode
} from "react";

import type {
    FollowUp,
    CreateFollowUpRequest,
    RescheduleFollowUpRequest,
    FollowUpStatusCount,
} from "@/shared/types/followUpTypes"

import {
    getMyCurrentFollowUps,
    getMyCurrentFollowUpCountByStatus,
    getFollowUpsByLead,
    createFollowUp,
    completeFollowUp,
    rescheduleFollowUp,
    scheduleNextFollowUp,
} from "@/services/followUp/FollowUpService";

import type { PageResponse } from "@/shared/types/api";


interface FollowUpContextType {

    // =========================
    // ESTADO
    // =========================

    followUps: FollowUp[];
    statusCounts: FollowUpStatusCount[];

    loading: boolean;
    error: string | null;

    page: number;
    totalPages: number;
    totalElements: number;


    // =========================
    // BUSCAS
    // =========================

    fetchMyFollowUps: (
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchFollowUpsByLead: (
        leadId: string,
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchStatusCounts: () => Promise<void>;


    // =========================
    // AÇÕES
    // =========================

    create: (
        leadId: string,
        data: CreateFollowUpRequest
    ) => Promise<FollowUp>;

    complete: (
        id: string
    ) => Promise<FollowUp>;

    reschedule: (
        id: string,
        data: RescheduleFollowUpRequest
    ) => Promise<FollowUp>;

    scheduleNext: (
        id: string,
        data: RescheduleFollowUpRequest
    ) => Promise<FollowUp>;


    // =========================
    // UTILITÁRIOS
    // =========================

    clearError: () => void;
}


const FollowUpContext = createContext<FollowUpContextType | undefined>(
    undefined
);


interface FollowUpProviderProps {
    children: ReactNode;
}


export function FollowUpProvider({
    children,
}: FollowUpProviderProps) {

    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [statusCounts, setStatusCounts] = useState<FollowUpStatusCount[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);


    // ======================================================
    // LIMPAR ERRO
    // ======================================================

    const clearError = useCallback(() => {
        setError(null);
    }, []);


    // ======================================================
    // BUSCAR FOLLOW-UPS DO USUÁRIO
    // ======================================================

    const fetchMyFollowUps = useCallback(
        async (
            pageNumber = 0,
            size = 10
        ) => {

            setLoading(true);
            setError(null);

            try {

                const response: PageResponse<FollowUp> =
                    await getMyCurrentFollowUps(
                        pageNumber,
                        size
                    );

                setFollowUps(response.content);

                setPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao buscar Follow-ups";

                setError(message);

            } finally {

                setLoading(false);

            }
        },
        []
    );


    // ======================================================
    // BUSCAR FOLLOW-UPS DE UM LEAD
    // ======================================================

    const fetchFollowUpsByLead = useCallback(
        async (
            leadId: string,
            pageNumber = 0,
            size = 10
        ) => {

            setLoading(true);
            setError(null);

            try {

                const response: PageResponse<FollowUp> =
                    await getFollowUpsByLead(
                        leadId,
                        pageNumber,
                        size
                    );

                setFollowUps(response.content);

                setPage(response.number);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao buscar histórico de Follow-ups";

                setError(message);

            } finally {

                setLoading(false);

            }
        },
        []
    );


    // ======================================================
    // CONTAGEM POR STATUS
    // ======================================================

    const fetchStatusCounts = useCallback(
        async () => {

            try {

                setError(null);

                const response =
                    await getMyCurrentFollowUpCountByStatus();

                setStatusCounts(response);

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao buscar contagem dos Follow-ups";

                setError(message);

            }
        },
        []
    );


    // ======================================================
    // CRIAR FOLLOW-UP
    // ======================================================

    const create = useCallback(
        async (
            leadId: string,
            data: CreateFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                const followUp =
                    await createFollowUp(
                        leadId,
                        data
                    );

                return followUp;

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao criar Follow-up";

                setError(message);

                throw err;
            }
        },
        []
    );


    // ======================================================
    // CONCLUIR FOLLOW-UP
    // ======================================================

    const complete = useCallback(
        async (
            id: string
        ): Promise<FollowUp> => {

            setError(null);

            try {

                const followUp =
                    await completeFollowUp(id);

                return followUp;

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao concluir Follow-up";

                setError(message);

                throw err;
            }
        },
        []
    );


    // ======================================================
    // REAGENDAR
    // ======================================================

    const reschedule = useCallback(
        async (
            id: string,
            data: RescheduleFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                const followUp =
                    await rescheduleFollowUp(
                        id,
                        data
                    );

                return followUp;

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao reagendar Follow-up";

                setError(message);

                throw err;
            }
        },
        []
    );


    // ======================================================
    // PRÓXIMO FOLLOW-UP
    // ======================================================

    const scheduleNext = useCallback(
        async (
            id: string,
            data: RescheduleFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                const followUp =
                    await scheduleNextFollowUp(
                        id,
                        data
                    );

                return followUp;

            } catch (err) {

                const message =
                    err instanceof Error
                        ? err.message
                        : "Erro ao agendar próximo Follow-up";

                setError(message);

                throw err;
            }
        },
        []
    );


    return (
        <FollowUpContext.Provider
            value={{
                followUps,
                statusCounts,

                loading,
                error,

                page,
                totalPages,
                totalElements,

                fetchMyFollowUps,
                fetchFollowUpsByLead,
                fetchStatusCounts,

                create,
                complete,
                reschedule,
                scheduleNext,

                clearError,
            }}
        >
            {children}
        </FollowUpContext.Provider>
    );
}


// ======================================================
// HOOK
// ======================================================

export function useFollowUp() {

    const context = useContext(FollowUpContext);

    if (!context) {
        throw new Error(
            "useFollowUp deve ser utilizado dentro de um FollowUpProvider"
        );
    }

    return context;
}