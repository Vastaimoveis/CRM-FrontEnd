export interface User {
  id: string;
  name: string;
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
  CURITIBA = "Curitiba",
}