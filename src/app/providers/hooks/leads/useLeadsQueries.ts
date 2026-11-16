
import { useCallback } from "react";

import {
    getFilteredLeads,
    getOportunity,
} from "@/services/leads/leadsService";

import useRequestLatest from "@/shared/utils/useRequestLatest";
import { useRequestPromise } from "@/shared/utils/useRequestPromise";

import type { LeadFilters } from "@/shared/types/filterTypes";
import { useAuth } from "../../Auth/AuthProvider";

export function useLeadQueries() {
    const { requestUser } = useAuth();

    const runLatest = useRequestLatest();
    const runPromise = useRequestPromise();

    const runFetchFilteredLeads = useCallback(
        async (filter: LeadFilters) => {
            if (!requestUser) return null;

            return runLatest(() =>
                getFilteredLeads(filter)
            );
        },
        [requestUser, runLatest]
    );

    const runFetchOportunidade = useCallback(
        async () => {
            if (!requestUser) return [];

            return runPromise(() =>
                getOportunity(requestUser.id)
            );
        },
        [requestUser, runPromise]
    );

    return {
        runFetchFilteredLeads,
        runFetchOportunidade,
    };
}
