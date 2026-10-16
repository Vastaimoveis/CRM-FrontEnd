
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
    getMyCurrentFollowUpCountByStatus,
    getFollowUpsByLead,
    createFollowUp,
    completeFollowUp,
    rescheduleFollowUp,
    scheduleNextFollowUp,
    getCurrentFollowUpsByUser,
    getMyFilteredFollowUps,
    getAllFilteredFollowUps
} from "@/services/followUp/FollowUpService";

import type { PageResponse } from "@/shared/types/api";
import type { FollowUpFilters } from "@/shared/types/filterTypes";

interface FollowUpContextType {
    followUps: FollowUp[];
    statusCounts: FollowUpStatusCount[];

    loading: boolean;
    error: string | null;

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

    fetchStatusCounts: () => Promise<void>;

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

    // Controle compartilhado por todas as buscas paginadas.
    const requestIdRef = useRef(0);

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

            const requestId = ++requestIdRef.current;

            setLoading(true);
            setError(null);

            try {

                const response = await request();

                if (requestId !== requestIdRef.current) return;

                updateFollowUpsPage(response);

            } catch (err) {

                if (requestId !== requestIdRef.current) return;

                setError(getErrorMessage(err, fallbackMessage));

            } finally {

                if (requestId === requestIdRef.current) {
                    setLoading(false);
                }
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
            const { userId: _userId, ...myFilters } = filters;
            void _userId;

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

            await runPageRequest(
                () => getAllFilteredFollowUps(
                    filters,
                    pageNumber,
                    size
                ),
                "Erro ao filtrar os Follow-ups"
            );
        },
        [runPageRequest]
    );

    const fetchStatusCounts = useCallback(async (): Promise<void> => {

        try {

            const response =
                await getMyCurrentFollowUpCountByStatus();

            setStatusCounts(response);

        } catch (err) {

            const message = getErrorMessage(
                err,
                "Erro ao buscar contagem dos Follow-ups"
            );

            console.error("Erro no fetchStatusCounts:", err);
            setError(message);
        }

    }, []);

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

                return await rescheduleFollowUp(data);

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

    const value = useMemo<FollowUpContextType>(() => ({

        followUps,
        statusCounts,

        loading,
        error,

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

        create,
        complete,
        reschedule,
        scheduleNext,

        clearError

    }), [
        followUps,
        statusCounts,
        loading,
        error,
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
        create,
        complete,
        reschedule,
        scheduleNext,
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