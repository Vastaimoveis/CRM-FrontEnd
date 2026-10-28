import { LeadStatus } from "./LeadType";

export enum FollowUpStatus {
    ATRASADO = "ATRASADO",
    PENDENTE = "PENDENTE",
    CONCLUIDO = "CONCLUIDO",
    REAGENDADO = "REAGENDADO",
    CANCELADO = "CANCELADO",
}

export interface LeadSummary {
        Id: String,
        nome: String,
        telefone: String,
        userId: String,
        status: LeadStatus
}

export interface FollowUp {
    id: string;
    lead: LeadSummary;

    followUpAtual: number;
    followUpTotal: number;

    proximoContato: string;
    ultimoContato: string | null;
    concluidoEm: string | null;
    encerradoEm: string | null;

    diasEmAtraso: number;
    status: FollowUpStatus;

    observacao: string | null;

    createdAt: string;
}

export interface CreateFollowUpRequest {
    antigoId: string;
    observacao: string;
}

export interface FollowUpStatusCount {
    status: FollowUpStatus;
    quantidade: number;
}

export interface RescheduleFollowUpRequest {
    id: string;
    proximoContato: string;
    observacao: string | null;
}

export interface FollowUpSummary {
    statusCounts: FollowUpStatusCount[];
    todayCount: number;
}