import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Lead, LeadPorCorretor } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";
import { useAuth } from "../Auth/AuthProvider";
import type { UpdateLeadDto } from "@/services/leads/types/leads";
import { useToast } from "../Toast/ToastProvider";
import { useFunnel } from "../Funnel/FunnelProvider";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorResponse";
import type { LeadFilters } from "@/shared/types/filterTypes";
import { useLeadQueries } from "../hooks/leads/useLeadsQueries";
import { useLeadMutations } from "../hooks/leads/useLeadsMutation";
import { getLeadsPorCorretor } from "@/services/leads/leadsService";


export interface LeadContextType {
    leads: Lead[];
    loading: boolean;

    filters: LeadFilters;
    setFilters: React.Dispatch<React.SetStateAction<LeadFilters>>
    totalPages: number;
    opportunities: Lead[];
    leadsPorCorretor: LeadPorCorretor[];
    loadingLeadsPorCorretor: boolean;

    fetchLeadsPorCorretor: () => Promise<void>;
    fetchFilteredLeads: (filters: LeadFilters) => Promise<void | null>;

    updateFilters: (partial: Partial<LeadFilters>) => void;

    fetchOportunidade: () => Promise<void>;
    updateLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead | null>;

    patchLeadStatus: (
        leadId: string,
        status: LeadStatus
    ) => Promise<Lead | null>

    patchLeadCorretor: (id: string, userId: string) => Promise<Lead | null>

    deleteLead: (id: string) => Promise<boolean>;
    handleEdit: (id: string, data: UpdateLeadDto) => Promise<boolean>;
    handleDateChange(start: string | null, end: string | null): void
}

const LeadContext =
    createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { requestUser } = useAuth();
    const { showToast } = useToast();
    const { fetchCountLeads } = useFunnel();
    const [opportunities, setOpportunities] = useState<Lead[]>([]);
    const [filters, setFilters] = useState<LeadFilters>({
        search: "",
        status: null,
        startDate: null,
        endDate: null,
        page: 0,
        userId: null
    }
    );
    const [leadsPorCorretor, setLeadsPorCorretor] =
        useState<LeadPorCorretor[]>([]);

    const [loadingLeadsPorCorretor, setLoadingLeadsPorCorretor] =
        useState(false);
    const updateFilters = useCallback(
        (partial: Partial<LeadFilters>) => {
            setFilters((prev) => ({
                ...prev,
                ...partial
            }));
        },
        []
    );

    const handleError = useCallback(
        (error: unknown) => {
            showToast(
                getApiErrorMessage(error),
                "error"
            );

            console.error(error);
        },
        [showToast]
    );

    const {
        runFetchFilteredLeads,
        runFetchOportunidade
    } = useLeadQueries();


    const {
        runDeleteLead,
        runHandleEdit,
        runPatchLeadCorretor,
        runPatchLeadStatus,
        runUpdateLeadStatus
    } = useLeadMutations();

    const fetchOportunidade = useCallback(async () => {
        setLoading(true);

        try {
            if (!requestUser) return;
            const response = await runFetchOportunidade();
            setOpportunities(response);
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
        }
    },
        [handleError, runFetchOportunidade, requestUser]
    )

    const fetchFilteredLeads = useCallback(
        async (filter: LeadFilters) => {
            setLoading(true);

            try {
                const response = await runFetchFilteredLeads(filter);

                if (!response) return;

                setTotalPages(response.totalPages);
                setLeads(response.content);
            } catch (error: unknown) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        },
        [runFetchFilteredLeads, handleError]
    );

    const updateLeadStatus = useCallback(
        async (id: string, status: LeadStatus
        ) => {
            setLoading(true);
            try {
                const updated =
                    await runUpdateLeadStatus(id, status)
                await fetchFilteredLeads(filters);
                await fetchCountLeads();
                return updated
            } catch (error) {
                handleError(error)
                return null;
            } finally {
                setLoading(false)
            }
        },
        [
            filters,
            fetchFilteredLeads,
            runUpdateLeadStatus,
            fetchCountLeads,
            handleError
        ]
    )

    const patchLeadStatus = useCallback(
        async (id: string, status: LeadStatus) => {
            try {
                const patched = await runPatchLeadStatus(id, status);

                if (!patched) return null;

                if (status === LeadStatus.ENCERRADO) {
                    setLeads(prev => prev.filter(lead => lead.id !== id));
                } else {
                    setLeads(prev =>
                        prev.map(lead =>
                            lead.id === id ? patched : lead
                        )
                    );
                }

                await fetchCountLeads();

                return patched;
            } catch (error: unknown) {
                handleError(error);
                return null;
            }
        },
        [runPatchLeadStatus, fetchCountLeads, handleError]
    );

    const fetchLeadsPorCorretor = useCallback(async () => {
        setLoadingLeadsPorCorretor(true);

        try {
            const response = await getLeadsPorCorretor();

            setLeadsPorCorretor(response);
        } catch (error) {
            handleError(error);
        } finally {
            setLoadingLeadsPorCorretor(false);
        }
    }, [handleError]);

    const patchLeadCorretor = useCallback(
        async (leadId: string, userId: string) => {
            try {
                const patched = await runPatchLeadCorretor(leadId, userId);

                setLeads(prev =>
                    prev.map(lead =>
                        lead.id === leadId ? patched : lead
                    )
                );

                return patched;
            } catch (error: unknown) {
                handleError(error);
                return null;
            }
        },
        [runPatchLeadCorretor, handleError]
    );

    const deleteLead = useCallback(async (
        id: string
    ): Promise<boolean> => {
        try {
            await runDeleteLead(id);

            setLeads(prev =>
                prev.filter(lead => lead.id !== id)
            );

            await fetchCountLeads();

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [runDeleteLead, fetchCountLeads, handleError]);
    const handleDateChange = useCallback(
        (start: string | null,
            end: string | null
        ) => {
            updateFilters(
                {
                    startDate: start,
                    endDate: end,
                    page: 0,
                }
            )
        },
        [updateFilters]
    )

    const handleEdit = useCallback(async (
        id: string,
        data: UpdateLeadDto
    ): Promise<boolean> => {
        try {
            const updatedLead = await runHandleEdit(id, data);

            setLeads(prev =>
                prev.map(lead =>
                    lead.id === id ? updatedLead : lead
                )
            );

            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [runHandleEdit, handleError]);

    useEffect(() => {
        updateFilters({ userId: requestUser?.id })
    }, [
        requestUser,
        updateFilters
    ])

    const value = useMemo(() => (
        {
            leads,
            fetchOportunidade,
            opportunities,
            fetchFilteredLeads,
            filters,
            setFilters,
            totalPages,
            loading,
            leadsPorCorretor,
            loadingLeadsPorCorretor,
            fetchLeadsPorCorretor,
            updateFilters,
            updateLeadStatus,
            handleDateChange,
            handleEdit,
            patchLeadStatus,
            patchLeadCorretor,
            deleteLead,
        }
    ), [
        leads,
        opportunities,
        filters,
        totalPages,
        loading,

        updateFilters,
        handleDateChange,
        patchLeadStatus,
        patchLeadCorretor,
        handleEdit,
        deleteLead,

        leadsPorCorretor,
        loadingLeadsPorCorretor,
        fetchLeadsPorCorretor,

        fetchOportunidade,
        fetchFilteredLeads,
        updateLeadStatus
    ]
    )

    return (
        <LeadContext.Provider
            value={value}
        >
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error("useLeads deve ser usado dentro de LeadProvider");
    }
    return context;
}

