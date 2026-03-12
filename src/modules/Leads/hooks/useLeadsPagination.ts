import { useMemo } from "react";
import { type Lead } from "@/shared/types/LeadType";

interface UseLeadsPaginationProps {
    leads: Lead[];
    currentPage: number;
    itemsPerPage: number;
}

export function useLeadsPagination({
    leads,
    currentPage,
    itemsPerPage,
}: UseLeadsPaginationProps) {
    const totalPages = Math.ceil(leads.length / itemsPerPage);

    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return leads.slice(start, start + itemsPerPage);
    }, [leads, currentPage, itemsPerPage]);

    return {
        paginatedLeads,
        totalPages,
    };
}