import type { LeadStatus } from "@/shared/types/LeadType";

export interface countStatusResponse {
    total: number,
    porStatus: Record<LeadStatus, number>;
}

export interface LeadStatusChartData {
    status: LeadStatus;
    total: number;
}

export interface UpdateLeadDto {
    nome: string;
    email: string;
    telefone: string;
    status: LeadStatus;
}

export interface UpdateLeadStatusDTO{
    statusLead: LeadStatus;
}