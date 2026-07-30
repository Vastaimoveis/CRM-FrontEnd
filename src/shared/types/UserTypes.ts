import type { RoleResponseDTO } from "@/services/roles/roleTypes";

export interface User {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  regiao: RegioesEnum;
  role: RoleResponseDTO;

  permissions?: [];
}

export interface newRoles{
  id: string;
  name: string;
  description: string;

}

export enum Permissions{
    LEAD_VIEW = "LEAD_VIEW",
    LEAD_CREATE = "LEAD_CREATE",
    LEAD_EDIT = "LEAD_EDIT",
    LEAD_DELETE = "LEAD_DELETE",
    LEAD_EXPORT = "LEAD_EXPORT",

    USER_VIEW = "USER_VIEW",
    USER_CREATE = "USER_CREATE",
    USER_EDIT = "USER_EDIT",
    USER_DELETE = "USER_DELETE",
    USER_CHANGE_ROLE = "USER_CHANGE_ROLE",

    REPORT_VIEW = "REPORT_VIEW",
    REMINDER_CREATE = "REMINDER_CREATE",
    REMINDER_EDIT = "REMINDER_EDIT"
}

export enum UserRoles{
    CORRETOR = "CORRETOR",
    GERENTE = "GERENTE"
}

export enum RegioesEnum{
  CURITIBA = "CURITIBA",
}