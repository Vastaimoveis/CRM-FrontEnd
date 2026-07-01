import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Lead } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";
import { deleteLeadRequest, editLead, getFilteredLeads, getLeadById, getOportunity, patchCorretor, patchStatus, updateLeadRequest } from "@/services/leads/leadsService";
import { useAuth } from "./AuthProvider";
import type { LeadCorretorDTO, LeadStatusDTO, UpdateLeadDto } from "@/services/leads/types/leads";
import { useToast } from "./ToastProvider";
import { useFunnel } from "./FunnelProvider";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorResponse";
import type { LeadFilters } from "@/shared/types/filterTypes";


export interface LeadContextType {
    leads: Lead[];
    loading: boolean;

    filters: LeadFilters;
    setFilters: React.Dispatch<React.SetStateAction<LeadFilters>>
    totalPages: number;
    opportunities: Lead[];

    fetchFilteredLeads: (filters: LeadFilters) => Promise<void>;

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

    deleteLead: (id: string) => Promise<void>;
    handleEdit: (id: string, data: UpdateLeadDto) => Promise<void>;
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
    const [error, setError] = useState<string>("");
    const [filters, setFilters] = useState<LeadFilters>({
        search: "",
        status: null,
        startDate: null,
        endDate: null,
        page: 0,
        userId: null
    }
    );

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
    )

    const fetchOportunidade = useCallback(async () => {
        setLoading(true);

        try {
            if (!requestUser) return;
            const response = await getOportunity(requestUser.id);
            setOpportunities(response);
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
        }
    },
        [handleError, requestUser]
    )

    const fetchFilteredLeads = useCallback(
        async (filter: LeadFilters) => {

            if (!requestUser) return;
            setLoading(true);
            setError("");

            try {
                const response = await getFilteredLeads({
                    ...filter,
                    userId: requestUser.id, // 🔥 FORÇADO SEMPRE
                });
                if (!response.success || !response.data) {
                    setError(response.text || "Erro ao buscar leads");
                    showToast(error, "error")
                    return;
                }

                setTotalPages(response.data.totalPages);
                setLeads(response.data.content);
            } catch (error: unknown) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Erro ao buscar leads";

                setError(message);
                handleError(error);

            } finally {
                setLoading(false);
            }
        },
        [requestUser, handleError, showToast]
    );

    const updateLeadStatus = useCallback(
        async (id: string, status: LeadStatus
        ) => {
            setLoading(true);
            try {

                const lead = await getLeadById(id);
                const updatedDto = {
                    nome: lead.nome,
                    email: lead.email,
                    telefone: lead.telefone,
                    status,
                }

                const updated =
                    await updateLeadRequest(
                        id,
                        updatedDto
                    );
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
            fetchCountLeads,
            handleError
        ]
    )

    const patchLeadStatus = useCallback(
        async (id: string, status: LeadStatus
        ) => {
            try {
                const statusDTO: LeadStatusDTO = {
                    statusLead: status
                };

                const patched =
                    await patchStatus(id, statusDTO);

                if (status === LeadStatus.ENCERRADO) {

                    setLeads(prev =>
                        prev.filter(
                            lead => lead.id !== id
                        )
                    );

                } else {

                    setLeads(prev =>
                        prev.map(lead =>
                            lead.id === id
                                ? patched
                                : lead
                        )
                    );

                }

                await fetchCountLeads();

                return patched;

            } catch (error) {

                handleError(error);

                return null;

            }
        },
        [fetchCountLeads, handleError]
    )

    const patchLeadCorretor = useCallback(
        async (leadId: string, userId: string
        ) => {
            try {
                const corretorDTO: LeadCorretorDTO = {
                    userId: userId
                };

                const patched =
                    await patchCorretor(leadId, corretorDTO);

                setLeads(prev =>
                    prev.map(lead =>
                        lead.id === leadId
                            ? patched
                            : lead
                    )
                );

                await fetchCountLeads();
                return patched;

            } catch (error) {

                handleError(error);

                return null;

            }
        },
        [fetchCountLeads, handleError]
    )



    const deleteLead = useCallback(
        async (id: string) => {
            try {
                await deleteLeadRequest(id);
                setLeads(prev =>
                    prev.filter(
                        lead => lead.id !== id
                    )
                );
                await fetchCountLeads();
            } catch (error) {
                handleError(error);

            }
        },
        [fetchCountLeads, handleError]
    )

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

    const handleEdit = useCallback(async (id: string, data: UpdateLeadDto) => {
        const updatedLead = await editLead(id, data);

        setLeads(prev =>
            prev.map(lead =>
                lead.id === id
                    ? { ...lead, ...updatedLead }
                    : lead
            )
        );
    }, [fetchFilteredLeads])


    useEffect(() => {
        if (error) {
            showToast(error, "error");
        }
    }, [error]);


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

