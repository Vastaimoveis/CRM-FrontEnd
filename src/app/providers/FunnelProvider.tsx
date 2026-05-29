import { createContext, useContext, useState, type ReactNode } from "react";
import type { CreateLeadDTO } from "@/shared/types/LeadType";
import { createLeadRequest, EMPTY_LEADS_COUNT, getLeadsStatus } from "@/services/leads/leadsService";
import type { countStatusResponse } from "@/services/leads/types/leads";
import { normalizeLeadStatusResponse } from "@/services/leads/helper";

interface FunnelContextType {
    countLeads: countStatusResponse;

    fetchCountLeads: () => Promise<void>;
    createLead: (
        data: CreateLeadDTO
    ) => Promise<void>;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
    const [countLeads, setCountLeads] = useState<countStatusResponse>(EMPTY_LEADS_COUNT);

    async function createLead(
        data: CreateLeadDTO
    ) {
        await createLeadRequest(data);
        await fetchCountLeads();
    }

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
        <FunnelContext.Provider
            value={{
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