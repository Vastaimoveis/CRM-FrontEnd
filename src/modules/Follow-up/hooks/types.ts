import type { LeadStatus } from "@/shared/types/LeadType";

export enum FollowUpTab {
    ATRASADO = "atrasados",
    HOJE = "hoje",
    PROXIMOS = "proximos",
    CONCLUIDOS = "concluidos"
};

export interface followUpLead {
    id: string,
    cliente: string,
    telefone: string,
    status: LeadStatus,
    etapa: string,
    ultimoContato: string,
    proximoContato: string,
    diasAtraso: number,
};

export const statusStyles: Record<string, string> = {
    CADASTRADO: "bg-slate-100 text-slate-600",
    ATENDIMENTO: "bg-sky-100 text-sky-700",
    AGUARDANDO: "bg-amber-100 text-amber-700",
    VISITA: "bg-violet-100 text-violet-700",
    NEGOCIACAO: "bg-rose-100 text-rose-700",
};

export interface typeTabs {
    id: FollowUpTab;
    label: string;
    count: number;
}
