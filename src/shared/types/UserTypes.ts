export interface User {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  regiao: RegioesEnum;
  role: UserRoles;
}

export enum UserRoles{
    CORRETOR = "CORRETOR",
    GERENTE = "GERENTE"
}

export enum RegioesEnum{
  CURITIBA = "CURITIBA",
}