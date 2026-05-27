import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import type { Lead, CreateLeadDTO } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";
import { createLeadRequest, deleteLeadRequest, EMPTY_LEADS_COUNT, getLeadById, getLeads, getLeadsByUserId, getLeadsStatus, updateLeadRequest, type countStatusResponse } from "@/services/leads/leadsService";
import { useAuth } from "./AuthProvider";
import { normalizeLeadStatusResponse } from "@/services/leads/helper";


interface LeadContextType {
    leads: Lead[];
    loading: boolean;

    page: number;
    totalPages: number;

    countLeads: countStatusResponse;

    setPage: React.Dispatch<React.SetStateAction<number>>;

    fetchLeads: () => Promise<void>;
    fetchCountLeads: () => Promise<void>;
    createLead: (
        data: CreateLeadDTO
    ) => Promise<void>;

    updateLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead>;

    deleteLead: (id: string) => Promise<void>;

    importLeads: (leads: Lead[]) => Promise<void>;
}

const LeadContext =
    createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [countLeads, setCountLeads] = useState<countStatusResponse>(EMPTY_LEADS_COUNT);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    async function fetchLeads() {
        setLoading(true);

        try {

            const response = await getLeads(page);

            setLeads(response.content);

            setTotalPages(response.totalPages);
        } finally {
            setLoading(false);
        }
    }

    async function fetchAllleads(userId: string) {
        setLoading(true)
        try {
            const response = await getLeadsByUserId(userId);

            setAllLeads(response)
            await fetchCountLeads();
        } finally {
            setLoading(false)
        }
    }

    async function createLead(
        data: CreateLeadDTO
    ) {
        await createLeadRequest(data);

        await fetchLeads();
        await fetchCountLeads();
    }

    async function updateLeadStatus(
        id: string,
        status: LeadStatus
    ) {
        const createLeadDto = await getLeadById(id);

        const updatedLeadDto = { ...createLeadDto, status: status }

        const updated =
            await updateLeadRequest(
                id,
                await updatedLeadDto
            );
        await fetchLeads();
        await fetchCountLeads();
        return updated
    }

    async function deleteLead(id: string) {
        await deleteLeadRequest(id);
        await fetchLeads();
    }

    async function importLeads(newLeads: Lead[]) {
        setLoading(true);
        try {
            for (const lead of newLeads) {
                await createLeadRequest({
                    nome: lead.nome,
                    email: lead.email,
                    telefone: lead.telefone,
                });
            }
            await fetchLeads();
            await fetchCountLeads();
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function load() {

            await fetchLeads();
            await fetchCountLeads();

        }
        load();
    }, [page]);

    useEffect(() => {
        if (!user?.id) {
            return;
        }
        fetchAllleads(user.id);
    }, [user])

    async function fetchCountLeads() {
        try {

            const data = await getLeadsStatus();

            setCountLeads(normalizeLeadStatusResponse(data));

        } catch (error) {

            console.error(
                "Erro ao buscar contagem de leads",
                error
            );
        }
    }

    return (
        <LeadContext.Provider
            value={{
                leads,
                loading,
                page,
                countLeads,
                totalPages,
                setPage,
                createLead,
                fetchLeads,
                fetchCountLeads,
                updateLeadStatus,
                deleteLead,
                importLeads,
            }}
        >
            {children}
        </LeadContext.Provider>
    );
}

export function useLeads() {
    const context = useContext(LeadContext);
    if (!context) {
        throw new Error("useLeads must be used inside LeadProvider");
    }
    return context;
}

