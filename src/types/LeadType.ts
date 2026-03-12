export enum LeadStatus {
  CADASTRADO = "Cadastrado",
  ATENDIMENTO = "Atendimento",
  AGUARDANDO = "Aguardando",
  VISITA = "Visita",
  NEGOCIACAO = "Negociacao",
  VENDA = "Venda",
}
export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  status: LeadStatus;
}

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone: string;
  status: LeadStatus;
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  Cadastrado: "#6B7280",     // cinza
  Atendimento: "#3B82F6",    // azul
  Aguardando: "#F59E0B",     // amarelo
  Visita: "#8B5CF6",         // roxo
  Negociacao: "#EF4444",     // vermelho
  Venda: "#10B981",          // verde
};

