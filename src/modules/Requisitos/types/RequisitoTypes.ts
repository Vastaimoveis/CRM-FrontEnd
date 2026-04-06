export enum RequisitoStatus {
  PENDENTE = "pendente",
  LIDO = "lido",
  RESPONDIDO = "respondido"
}

export interface Requisito {
  id: string;
  assunto: string;
  mensagem: string;
  dataEnvio: string;
  status: RequisitoStatus;
  corretor: string;
}