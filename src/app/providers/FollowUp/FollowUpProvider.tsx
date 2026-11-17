
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ReactNode
} from "react";

import type {
    FollowUp,
    CreateFollowUpRequest,
    RescheduleFollowUpRequest,
    FollowUpStatusCount
} from "@/shared/types/followUpTypes";

import {
    getMyCurrentFollowUps,
    getFollowUpsByLead,
    createFollowUp,
    completeFollowUp,
    rescheduleFollowUp,
    scheduleNextFollowUp,
    getCurrentFollowUpsByUser,
    getMyFilteredFollowUps,
    getAllFilteredFollowUps,
    cancelFollowUp,
    getCurrentFollowUpSummary
} from "@/services/followUp/FollowUpService";

import type { PageResponse } from "@/shared/types/api";
import type { FollowUpFilters } from "@/shared/types/filterTypes";
import { useAuth } from "../Auth/AuthProvider";

interface FollowUpContextType {
    followUps: FollowUp[];
    statusCounts: FollowUpStatusCount[];
    statusCountsLoaded: boolean;
    loading: boolean;
    error: string | null;

    todayCount: number;

    page: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    totalPages: number;
    totalElements: number;

    fetchMyFollowUps: (
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchFollowUpsByLead: (
        leadId: string,
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchFollowUpsByUser: (
        userId: string,
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchMyFilteredFollowUps: (
        filters?: FollowUpFilters,
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchAllFilteredFollowUps: (
        filters?: FollowUpFilters,
        page?: number,
        size?: number
    ) => Promise<void>;

    fetchStatusCounts: (userId?: string) => Promise<void>;
    create: (
        leadId: string,
        data: CreateFollowUpRequest
    ) => Promise<FollowUp>;

    complete: (id: string) => Promise<FollowUp>;

    reschedule: (
        data: RescheduleFollowUpRequest
    ) => Promise<FollowUp>;

    scheduleNext: (
        id: string,
        data: CreateFollowUpRequest
    ) => Promise<FollowUp>;
    cancel: (id: string) => Promise<FollowUp>;

    refreshFollowUpData: () => Promise<void>;

    clearError: () => void;
}

const FollowUpContext = createContext<
    FollowUpContextType | undefined
>(undefined);

interface FollowUpProviderProps {
    children: ReactNode;
}

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    return error instanceof Error
        ? error.message
        : fallback;
}

export function FollowUpProvider({
    children
}: FollowUpProviderProps) {

    const [followUps, setFollowUps] = useState<FollowUp[]>([]);
    const [statusCounts, setStatusCounts] =
        useState<FollowUpStatusCount[]>([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [first, setFirst] = useState(true);
    const [last, setLast] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [statusCountsLoaded, setStatusCountsLoaded] = useState(false);
    const [todayCount, setTodayCount] = useState<number>(0);
    const { user } = useAuth();

    // Controle compartilhado por todas as buscas paginadas.
    const isPageRequestInProgress = useRef(false);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const updateFollowUpsPage = useCallback(
        (response: PageResponse<FollowUp>) => {

            setFollowUps(response.content);

            setPage(response.number);
            setPageSize(response.size);

            setFirst(response.first);
            setLast(response.last);

            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        },
        []
    );

    // Executa qualquer consulta paginada e ignora respostas antigas.

    const runPageRequest = useCallback(
        async (
            request: () => Promise<PageResponse<FollowUp>>,
            fallbackMessage: string
        ): Promise<void> => {

            // Impede uma nova chamada enquanto outra estiver executando.
            if (isPageRequestInProgress.current) return;

            isPageRequestInProgress.current = true;

            setLoading(true);
            setError(null);

            try {

                const response = await request();

                updateFollowUpsPage(response);

            } catch (err) {

                setError(getErrorMessage(err, fallbackMessage));

            } finally {

                isPageRequestInProgress.current = false;
                setLoading(false);

            }
        },
        [updateFollowUpsPage]
    );


    const fetchMyFollowUps = useCallback(
        async (
            pageNumber = 0,
            size = 10
        ): Promise<void> => {

            await runPageRequest(
                () => getMyCurrentFollowUps(pageNumber, size),
                "Erro ao buscar Follow-ups"
            );
        },
        [runPageRequest]
    );

    const fetchFollowUpsByLead = useCallback(
        async (
            leadId: string,
            pageNumber = 0,
            size = 10
        ): Promise<void> => {

            await runPageRequest(
                () => getFollowUpsByLead(
                    leadId,
                    pageNumber,
                    size
                ),
                "Erro ao buscar histórico de Follow-ups"
            );
        },
        [runPageRequest]
    );

    const fetchFollowUpsByUser = useCallback(
        async (
            userId: string,
            pageNumber = 0,
            size = 10
        ): Promise<void> => {

            await runPageRequest(
                () => getCurrentFollowUpsByUser(
                    userId,
                    pageNumber,
                    size
                ),
                "Erro ao buscar Follow-ups do corretor"
            );
        },
        [runPageRequest]
    );

    const fetchMyFilteredFollowUps = useCallback(
        async (
            filters: FollowUpFilters = {},
            pageNumber = 0,
            size = 10
        ): Promise<void> => {

            // Nunca encaminha userId ao filtro pessoal.
            const {
                userId: _userId,
                tab: _tab,
                ...myFilters
            } = filters;

            void _userId;
            void _tab;

            await runPageRequest(
                () => getMyFilteredFollowUps(
                    myFilters,
                    pageNumber,
                    size
                ),
                "Erro ao filtrar seus Follow-ups"
            );
        },
        [runPageRequest]
    );

    const fetchAllFilteredFollowUps = useCallback(
        async (
            filters: FollowUpFilters = {},
            pageNumber = 0,
            size = 10
        ): Promise<void> => {

            const { tab: _tab, ...apiFilters } = filters;
            void _tab;

            await runPageRequest(
                () => getAllFilteredFollowUps(
                    apiFilters,
                    pageNumber,
                    size
                ),
                "Erro ao filtrar os Follow-ups"
            );
        },
        [runPageRequest]
    );

    const fetchStatusCounts = useCallback(
    async (userId?: string): Promise<void> => {

        if (!user?.id) return;

        setStatusCountsLoaded(false);

        try {

            const response = await getCurrentFollowUpSummary(userId);

            setStatusCounts(response.statusCounts ?? []);
            setTodayCount(response.todayCount ?? 0);

            setStatusCountsLoaded(true);

        } catch (err) {

            console.error("Erro ao buscar indicadores:", err);

            setStatusCounts([]);
            setTodayCount(0);

            setStatusCountsLoaded(true);
        }

    },
    [user?.id]
);

    const create = useCallback(
        async (
            leadId: string,
            data: CreateFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                return await createFollowUp(leadId, data);

            } catch (err) {

                setError(getErrorMessage(
                    err,
                    "Erro ao criar Follow-up"
                ));

                throw err;
            }
        },
        []
    );

    const complete = useCallback(
        async (id: string): Promise<FollowUp> => {

            setError(null);

            try {

                return await completeFollowUp(id);

            } catch (err) {

                setError(getErrorMessage(
                    err,
                    "Erro ao concluir Follow-up"
                ));

                throw err;
            }
        },
        []
    );

    const reschedule = useCallback(
        async (
            data: RescheduleFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                return await rescheduleFollowUp({
                    ...data,
                    proximoContato: `${data.proximoContato}T00:00:00`
                });

            } catch (err) {

                setError(getErrorMessage(
                    err,
                    "Erro ao reagendar Follow-up"
                ));

                throw err;
            }
        },
        []
    );

    const scheduleNext = useCallback(
        async (
            id: string,
            data: CreateFollowUpRequest
        ): Promise<FollowUp> => {

            setError(null);

            try {

                return await scheduleNextFollowUp(id, data);

            } catch (err) {

                setError(getErrorMessage(
                    err,
                    "Erro ao agendar próximo Follow-up"
                ));

                throw err;
            }
        },
        []
    );

    const cancel = useCallback(async (id: string): Promise<FollowUp> => {
        setError(null);

        try {
            return await cancelFollowUp(id);
        } catch (error) {
            setError("Não foi possível cancelar o ciclo de Follow-ups.");
            throw error;
        }
    }, []);

    const refreshFollowUpData = useCallback(async () => {
        await Promise.all([
            fetchMyFollowUps(),
            fetchStatusCounts()
        ]);
    }, [fetchMyFollowUps, fetchStatusCounts]);

    const value = useMemo<FollowUpContextType>(() => ({

        followUps,
        statusCounts,
        statusCountsLoaded,

        loading,
        error,
        cancel,

        page,
        pageSize,
        first,
        last,
        totalPages,
        totalElements,

        fetchMyFollowUps,
        fetchFollowUpsByLead,
        fetchFollowUpsByUser,

        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps,
        fetchStatusCounts,

        todayCount,

        create,
        complete,
        reschedule,
        scheduleNext,
        refreshFollowUpData,

        clearError

    }), [
        followUps,
        statusCounts,
        statusCountsLoaded,
        loading,
        error,
        cancel,
        page,
        pageSize,
        first,
        last,
        totalPages,
        totalElements,
        todayCount,
        fetchMyFollowUps,
        fetchFollowUpsByLead,
        fetchFollowUpsByUser,
        fetchMyFilteredFollowUps,
        fetchAllFilteredFollowUps,
        fetchStatusCounts,
        create,
        complete,
        reschedule,
        scheduleNext,
        refreshFollowUpData,
        clearError
    ]);

    return (
        <FollowUpContext.Provider value={value}>
            {children}
        </FollowUpContext.Provider>
    );
}

export function useFollowUp(): FollowUpContextType {

    const context = useContext(FollowUpContext);

    if (!context) {
        throw new Error(
            "useFollowUp deve ser utilizado dentro de um FollowUpProvider"
        );
    }

    return context;
}