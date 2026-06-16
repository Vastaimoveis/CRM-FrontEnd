import type { LeadStatus } from "./LeadType";

export type LeadFilters = {
    search: string;
    status: LeadStatus | null;
    startDate: string | null;
    endDate: string | null;
    page: number;
    userId: string | null;
};