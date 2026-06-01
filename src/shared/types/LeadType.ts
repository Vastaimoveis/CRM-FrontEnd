export enum LeadStatus {
  CADASTRADO = "CADASTRADO",
  ATENDIMENTO = "ATENDIMENTO",
  AGUARDANDO = "AGUARDANDO",
  VISITA = "VISITA",
  NEGOCIACAO = "NEGOCIACAO",
  VENDA = "VENDA",
  ENCERRADO = "ENCERRADO"
}
export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;

  status: LeadStatus;
  hasNotes: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone: string;
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  CADASTRADO: "#6B7280",     // cinza
  ATENDIMENTO: "#3B82F6",    // azul
  AGUARDANDO: "#F59E0B",     // amarelo
  VISITA: "#8B5CF6",         // roxo
  NEGOCIACAO: "#EF4444",     // vermelho
  VENDA: "#10B981",          // verde
  ENCERRADO: "#ff1f1f"
};