import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import type { Lead } from "@/shared/types/LeadType";
import { LeadStatus } from "@/shared/types/LeadType";
import { createLeadRequest, deleteLeadRequest, getAllLeadsNotEncerrado, getLeadById, getLeadsBySearch, getLeadsByUserId, getLeadsFilterByStatus, getOportunity, patchStatus, updateLeadRequest } from "@/services/leads/leadsService";
import { useAuth } from "./AuthProvider";
import type { LeadStatusDTO } from "@/services/leads/types/leads";
import { useToast } from "./ToastProvider";
import { useFunnel } from "./FunnelProvider";


export interface LeadContextType {
    leads: Lead[];
    allLeads: Lead[];

    loading: boolean;

    page: number;
    totalPages: number;


    setPage: React.Dispatch<React.SetStateAction<number>>;

    fetchLeads: (page: number) => Promise<void>;

    fetchByStatus: (status: LeadStatus, actualPage: number) => Promise<void>;

    fetchBySearch: (search: string, actualPage: number) => Promise<void>;
    opportunities: Lead[];

    fetchOportunidade: () => Promise<void>;
    updateLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead>;

    patchLeadStatus: (
        id: string,
        status: LeadStatus
    ) => Promise<Lead>

    deleteLead: (id: string) => Promise<void>;

    importLeads: (leads: Lead[]) => Promise<void>;
}

const LeadContext =
    createContext<LeadContextType | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();
    const { fetchCountLeads } = useFunnel();
    const [loaded, setLoaded] = useState(false);
    const [opportunities, setOpportunities] = useState<Lead[]>([]);

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

        } finally {
            setLoading(false);
        }
    }

    async function fetchOportunidade() {
        setLoading(true);

        try {
            const response = await getOportunity();

            setOpportunities(response);
        } finally {
            setLoading(false);
        }
    }

    async function fetchByStatus(status: LeadStatus, actualPage = 0) {
        setLoading(true)
        setPage(actualPage);

        try {
            const response = await getLeadsFilterByStatus({ statusLead: status },)
            setTotalPages(response.totalPages)
            if (response.totalPages >= page) {
                setLeads(response.content);
            } else {
                showToast("Página máxima atingida", "warning")
            }

        } finally {
            setLoading(false);
            setPage(0)
        }
    }

    async function fetchAllLeads(userId: string) {
        setLoading(true)
        try {
            const response = await getLeadsByUserId(userId);

            setAllLeads(response)
        } finally {
            setLoading(false)
        }
    }

    async function fetchBySearch(search: string, page: number) {
        setLoading(true)
        try {
            const response = await getLeadsBySearch(search, page)
            setTotalPages(response.totalPages)
            if (response.totalPages >= page) {
                setLeads(response.content);
            } else {
                showToast("Página máxima atingida", "warning")
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateLeadStatus(
        id: string,
        status: LeadStatus
    ) {
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
    }

    async function patchLeadStatus(id: string, status: LeadStatus) {
        const statusDTO: LeadStatusDTO = { statusLead: status }

        const patched = await patchStatus(id, statusDTO)

        await fetchLeads();
        await fetchCountLeads();

        return patched;
    }

    async function deleteLead(id: string) {
        await deleteLeadRequest(id);
        await fetchLeads();
        await fetchCountLeads();

    }

    async function importLeads(newLeads: Lead[]) {
        setLoading(true);
        try {
            for (const lead of newLeads) {
                await createLeadRequest({
                    nome: lead.nome,
                    email: lead.email,
                    telefone: lead.telefone,
                    status: lead.status
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
        fetchAllLeads(user.id);
    }, [user])



    return (
        <LeadContext.Provider
            value={{
                leads,
                allLeads,
                fetchOportunidade,
                opportunities,
                loading,
                fetchByStatus,
                fetchBySearch,
                page,
                totalPages,
                setPage,
                fetchLeads,
                updateLeadStatus,
                patchLeadStatus,
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
        throw new Error("useLeads deve ser usado dentro de LeadProvider");
    }
    return context;
}

