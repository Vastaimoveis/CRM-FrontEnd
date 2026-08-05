import type { LeadOrigem, LeadStatus } from "@/shared/types/LeadType";

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
    origem: LeadOrigem;
}

export interface LeadStatusDTO{
    statusLead: LeadStatus;
}

export interface LeadCorretorDTO{
    userId: string
}