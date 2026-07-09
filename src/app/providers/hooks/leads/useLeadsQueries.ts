import { useCallback } from "react";
import { getFilteredLeads, getOportunity } from "@/services/leads/leadsService";
import useRequestLatest from "@/shared/utils/useRequestLatest";
import { useRequestPromise } from "@/shared/utils/useRequestPromise";
import type { LeadFilters } from "@/shared/types/filterTypes";
import { useAuth } from "../../AuthProvider";

export function useLeadQueries() {
    const { requestUser } = useAuth();

    const runLatest = useRequestLatest();
    const runPromise = useRequestPromise();

    const runFetchFilteredLeads = useCallback(async (
        filter: LeadFilters
    ) => {

        if (!requestUser) return null;

        return runLatest(async () => {
            return getFilteredLeads({
                ...filter,
                userId: requestUser.id
            });
        });

    }, [
        requestUser,
        runLatest
    ]);


    const runFetchOportunidade = useCallback(async () => {

        if (!requestUser) return [];

        return runPromise(async () => {
            return getOportunity(requestUser.id);
        });

    }, [
        requestUser,
        runPromise
    ]);


    return {
        runFetchFilteredLeads,
        runFetchOportunidade
    };
}