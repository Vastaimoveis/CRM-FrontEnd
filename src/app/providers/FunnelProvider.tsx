import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CreateLeadDTO, Lead } from "@/shared/types/LeadType";
import { createLeadRequest, EMPTY_LEADS_COUNT, getLeadsStatus } from "@/services/leads/leadsService";
import type { countStatusResponse } from "@/services/leads/types/leads";
import { normalizeLeadStatusResponse } from "@/services/leads/helper";
import { useAuth } from "./AuthProvider";

interface FunnelContextType {
    countLeads: countStatusResponse;
    totalLeads: number;

    fetchCountLeads: () => Promise<void>;
    createLead: (
        data: CreateLeadDTO
    ) => Promise<Lead>;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
    const [countLeads, setCountLeads] = useState<countStatusResponse>(EMPTY_LEADS_COUNT);
    const [totalLeads, setTotalLeads] = useState<number>(0);
    const { requestUser } = useAuth();

    async function createLead(
        data: CreateLeadDTO
    ) {
        const response = await createLeadRequest(data);
        await fetchCountLeads();

        return response;
    }

    async function fetchCountLeads() {
        try {
            if (!requestUser) return;
            const data = await getLeadsStatus(requestUser.id);

            setCountLeads(normalizeLeadStatusResponse(data));
            setTotalLeads(data.total);

        } catch (error) {

            console.error(
                "Erro ao buscar contagem de leads",
                error
            );
        }
    }

    useEffect(() => {
        fetchCountLeads();
    }, [requestUser]);

    return (
        <FunnelContext.Provider
            value={{
                totalLeads,
                createLead,
                countLeads,
                fetchCountLeads,
            }}
        >
            {children}
        </FunnelContext.Provider>
    )
}

export function useFunnel() {
    const context = useContext(FunnelContext);
    if (!context) {
        throw new Error("useFunnel deve ser usado dentro de FunnelProvider")
    }

    return context;
}