import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Lead } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";
import { deleteLeadRequest, getAllLeadsNotEncerrado, getFilteredLeads, getLeadById, getOportunity, patchStatus, updateLeadRequest } from "@/services/leads/leadsService";
import { useAuth } from "./AuthProvider";
import type { LeadStatusDTO } from "@/services/leads/types/leads";
import { useToast } from "./ToastProvider";
import { useFunnel } from "./FunnelProvider";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorResponse";


export interface LeadContextType {
    leads: Lead[];
    loading: boolean;

    page: number;
    totalPages: number;
    opportunities: Lead[];
    setPage: React.Dispatch<React.SetStateAction<number>>;
    startDate: string | null;
    setStartDate: React.Dispatch<React.SetStateAction<string | null>>
    endDate: string | null;
    setEndDate: React.Dispatch<React.SetStateAction<string | null>>
    fetchLeads: (page: number) => Promise<void>;

    fetchFilteredLeads: (
        search: string,
        status: LeadStatus | null,
        user: string | null,
        startDate: string | null,
        endDate: string | null,
        page: number
    ) => Promise<void>;

    fetchOportunidade: () => Promise<void>;
    updateLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead | null>;

    patchLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead | null>

    deleteLead: (id: string) => Promise<void>;
    handleDateChange(start: string | null, end: string | null): void
}

const LeadContext =
    createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();
    const { fetchCountLeads } = useFunnel();
    const [loaded, setLoaded] = useState(false);
    const [opportunities, setOpportunities] = useState<Lead[]>([]);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    async function fetchLeads(actualPage = 0) {
        if (loading) return;

        setLoading(true);

        try {
            const response = await getAllLeadsNotEncerrado(actualPage, user);

            if (!response) {
                showToast("Nenhum lead encontrado", "warning");
                return;
            }

            setPage(actualPage);
            setTotalPages(response.totalPages);

            if (response.totalPages > actualPage) {
                setLeads(response.content);
                await fetchCountLeads();
                setLoaded(true);
            } else {
                showToast("Página máxima atingida", "warning");
            }

        } catch (error) {
            showToast(
                getApiErrorMessage(error),
                "error"
            );
        } finally {
            setLoading(false);
        }
    }

    async function fetchOportunidade() {
        setLoading(true);

        try {
            const response = await getOportunity();

            setOpportunities(response);
        } catch (error) {
            handleError(error)
        } finally {
            setLoading(false);
        }
    }

    async function fetchFilteredLeads(
        search: string,
        status: LeadStatus | null,
        userId: string | null,
        startDate: string | null,
        endDate: string | null,
        actualPage = 0
    ) {
        setLoading(true);

        try {
            const response =
                await getFilteredLeads(
                    search,
                    status ?? null,
                    userId,
                    startDate,
                    endDate,
                    actualPage
                );

            setPage(actualPage);
            setTotalPages(response.totalPages);
            setLeads(response.content);

        } catch (error) {

            handleError(error);

        } finally {

            setLoading(false);

        }
    }

    async function updateLeadStatus(
        id: string,
        status: LeadStatus
    ) {
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
            await fetchLeads();
            await fetchCountLeads();
            return updated
        } catch (error) {
            handleError(error)
            return null;
        } finally {
            setLoading(false)
        }
    }

    async function patchLeadStatus(
        id: string,
        status: LeadStatus
    ) {
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
    }

    async function deleteLead(id: string) {

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
    }

    function handleDateChange(start: string | null, end: string | null) {
        setStartDate(start);
        setEndDate(end);
        setPage(0);
    }

    useEffect(() => {
        async function load() {
            if (loaded) return; // 👈 evita múltiplas chamadas

            await fetchLeads();
            await fetchCountLeads();
        }

        load();
    }, [user]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }

    }, [user])

    function handleError(error: unknown) {

        showToast(
            getApiErrorMessage(error),
            "error"
        );

        console.error(error);
    }

    return (
        <LeadContext.Provider
            value={{
                leads,
                fetchOportunidade,
                opportunities,
                fetchFilteredLeads,
                endDate,
                setEndDate,
                setStartDate,
                startDate,
                loading,
                page,
                totalPages,
                setPage,
                fetchLeads,
                updateLeadStatus,
                handleDateChange,
                patchLeadStatus,
                deleteLead,
            }}
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

