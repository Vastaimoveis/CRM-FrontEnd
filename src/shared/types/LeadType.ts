export enum LeadStatus {
  CADASTRADO = "CADASTRADO",
  ATENDIMENTO = "ATENDIMENTO",
  AGUARDANDO = "AGUARDANDO",
  VISITA = "VISITA",
  NEGOCIACAO = "NEGOCIACAO",
  VENDA = "VENDA",
  ENCERRADO = "ENCERRADO"
}
export enum LeadOrigem {
  CRM = "CRM",
  SITE = "SITE",
  FACEBOOK = "FACEBOOK",
  GOOGLE = "GOOGLE",
  WHATSAPP = "WHATSAPP",
  OUTROS = "OUTROS"
}

export interface Lead {
  id: string;
  userId: string;
  nome: string;
  email: string;
  telefone: string;

  status: LeadStatus;
  hasNotes: boolean;
  createdAt: Date;
  updatedAt: Date;
  origem: LeadOrigem;
}

export interface CreateLeadDTO {
  nome: string;
  email: string;
  telefone: string;
  status: LeadStatus;
  origem: LeadOrigem
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