export enum FollowUpStatus {
    PENDENTE = "PENDENTE",
    CONCLUIDO = "CONCLUIDO",
    REAGENDADO = "REAGENDADO",
}

export interface FollowUp {
    id: string;
    leadId: string;

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
    followUpTotal: number;
    proximoContato: string;
    observacao?: string | null;
}

export interface FollowUpStatusCount {
    status: FollowUpStatus;
    quantidade: number;
}

export interface RescheduleFollowUpRequest {
    proximoContato: string;
    observacao: string | null;
}