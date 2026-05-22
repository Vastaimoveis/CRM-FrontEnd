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
import { createLeadRequest, deleteLeadRequest, getLeadById, getLeads, getLeadsByUserId, updateLeadRequest } from "@/services/leads/leadsService";
import { useAuth } from "./AuthProvider";


interface LeadContextType {
    leads: Lead[];
    loading: boolean;

    page: number;
    totalPages: number;

    setPage: React.Dispatch<React.SetStateAction<number>>;

    fetchLeads: () => Promise<void>;

    createLead: (
        data: CreateLeadDTO
    ) => Promise<void>;

    updateLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead>;

    deleteLead: (id: string) => Promise<void>;

    importLeads: (leads: Lead[]) => Promise<void>;

    leadsCountByStatus: Record<LeadStatus, number>;
}

const LeadContext =
    createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
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
        } finally {
            setLoading(false)
        }
    }

    async function createLead(
        data: CreateLeadDTO
    ) {
        await createLeadRequest(data);

        await fetchLeads();
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

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLeads();
    }, [page]);

    useEffect(() => {
        const userId = user?.id;
        if (userId === undefined) {
            return;
        }
        fetchAllleads(userId);
    }, [])

    async function countLeadStatus() {
        
    }

    const leadsCountByStatus = useMemo(() => {

        const counts: Record<LeadStatus, number> = {
            [LeadStatus.CADASTRADO]: 0,
            [LeadStatus.ATENDIMENTO]: 0,
            [LeadStatus.AGUARDANDO]: 0,
            [LeadStatus.VISITA]: 0,
            [LeadStatus.NEGOCIACAO]: 0,
            [LeadStatus.VENDA]: 0,
            [LeadStatus.ENCERRADO]: 0
        };

        for (const lead of allLeads) {
            if (counts[lead.status] !== undefined) {
                counts[lead.status] += 1;
            }
        }

        return counts;

    }, [leads]);

    return (
        <LeadContext.Provider
            value={{
                leads,
                loading,
                page,
                totalPages,
                setPage,
                createLead,
                fetchLeads,
                updateLeadStatus,
                deleteLead,
                importLeads,
                leadsCountByStatus,
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

