export type RequisitoStatus =
  | "pendente"
  | "lido"
  | "respondido";

export interface Requisito {
  id: string;
  assunto: string;
  mensagem: string;
  dataEnvio: string;
  status: RequisitoStatus;
  corretor: string;
}