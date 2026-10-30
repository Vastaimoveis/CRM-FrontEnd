import type { FollowUpStatus } from "./followUpTypes";
import type { LeadStatus } from "./LeadType";

export type FollowUpTab = "TODOS" | "HOJE" | FollowUpStatus;

export type LeadFilters = {
    search: string;
    status: LeadStatus | null;
    startDate: string | null;
    endDate: string | null;
    page: number;
    userId: string | null;
};

export type FollowUpFilters = {
    search?: string;
    status?: FollowUpStatus | null;
    tab?: FollowUpTab;
    userId?: string | null;
    startDate?: string | null;
    endDate?: string | null;
};