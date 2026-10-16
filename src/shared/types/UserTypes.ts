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
   LEAD_VIEW,
    LEAD_NOTIFICATION,
    LEAD_CREATE,
    LEAD_EDIT,
    LEAD_EDIT_PHONE,
    LEAD_PATCH_STATUS,
    LEAD_DELETE,
    LEAD_EXPORT,
    LEAD_ASSIGN,

    USER_VIEW,
    USER_VISUAL,
    USER_CREATE,
    USER_EDIT,
    USER_DELETE,
    USER_CHANGE_ROLE,

    REPORT_VIEW,
    REMINDER_VIEW,
    REMINDER_CREATE,
    REMINDER_PATCH,
    REMINDER_EDIT,
    REMINDER_DELETE,

    NOTE_VIEW,
    NOTE_CREATE,
    NOTE_DELETE,

    FOLLOWUP_VIEW,
    FOLLOWUP_VIEW_ALL,
    FOLLOWUP_VIEW_NEXT,
    FOLLOWUP_RESCHEDULE,
    FOLLOWUP_CREATE,
    FOLLOWUP_EDIT,
    FOLLOWUP_DELETE,
    FOLLOWUP_COMPLETE,
    FOLLOWUP_VIEW_USERS,
}

export enum RegioesEnum{
  CURITIBA = "CURITIBA",
}