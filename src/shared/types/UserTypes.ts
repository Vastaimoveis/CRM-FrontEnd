export interface User {
    id: string;
  name: string;
  email: string;
  role: UserRoles;
}

export enum UserRoles{
    CORRETOR = "Corretor",
    GERENTE = "Gerente"
}