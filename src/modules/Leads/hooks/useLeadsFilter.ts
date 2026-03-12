import { useEffect, useMemo, useState } from "react";
import { type Lead, LeadStatus } from "@/shared/types/LeadType";

interface UseLeadsFilterProps {
    leads: Lead[];
    status: LeadStatus | null;
    search: string;
}

export function useLeadsFilter({
    leads,
    status,
    search,
}: UseLeadsFilterProps) {
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const statusFiltered = useMemo(() => {
        if (!status) return leads;
        return leads.filter((lead) => lead.status === status);
    }, [leads, status]);

    const filteredLeads = useMemo(() => {
        if (!debouncedSearch.trim()) return statusFiltered;

        const searchLower = debouncedSearch.toLowerCase();
        const searchNumbers = debouncedSearch.replace(/\D/g, "");

        return statusFiltered.filter((lead) => {
            const telefoneLimpo = lead.telefone.replace(/\D/g, "");

            return (
                lead.nome.toLowerCase().includes(searchLower) ||
                lead.email.toLowerCase().includes(searchLower) ||
                (searchNumbers && telefoneLimpo.includes(searchNumbers))
            );
        });
    }, [statusFiltered, debouncedSearch]);

    return filteredLeads;
}