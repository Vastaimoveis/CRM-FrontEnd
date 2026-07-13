import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LeadOrigem, type CreateLeadDTO, type Lead } from "@/shared/types/LeadType";
import { createLeadRequest, EMPTY_LEADS_COUNT, getLeadsStatus } from "@/services/leads/leadsService";
import type { countStatusResponse } from "@/services/leads/types/leads";
import { normalizeLeadStatusResponse } from "@/services/leads/helper";
import { useAuth } from "./AuthProvider";
import useRequestLock from "@/shared/utils/useRequestLock";
import { useRequestPromise } from "@/shared/utils/useRequestPromise";

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
    const runLockedCreateLead = useRequestLock()
    const runRequestFetchCount = useRequestPromise();

    const fetchCountLeads = useCallback(async () => {
        try {
            if (!requestUser) return;
            return runRequestFetchCount(async () => {
                const data = await getLeadsStatus(requestUser.id);
                setCountLeads(normalizeLeadStatusResponse(data));
                setTotalLeads(data.total);
            });
        } catch (error) {

            console.error(
                "Erro ao buscar contagem de leads",
                error
            );
        }
    }, [
        getLeadsStatus,
        requestUser,
        setCountLeads,
        setTotalLeads,
    ])

    const createLead = useCallback(async (
        data: CreateLeadDTO
    ) => {
        return runLockedCreateLead(async () => {
            const response = await createLeadRequest({...data, origem: LeadOrigem.CRM});
            await fetchCountLeads();

            return response;
        })
    }, [
        fetchCountLeads
    ])


    useEffect(() => {
        fetchCountLeads();
    }, [requestUser]);

    const value = useMemo(() => ({
        totalLeads,
        createLead,
        countLeads,
        fetchCountLeads,

    }), [
        totalLeads,
        createLead,
        countLeads,
        fetchCountLeads,

    ])

    return (
        <FunnelContext.Provider
            value={value}
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