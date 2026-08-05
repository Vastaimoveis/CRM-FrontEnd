export interface PermissionResponseDTO {
    id: string;
    name: PermissionName;
    description: string;
}

export enum PermissionName {
    LEAD_VIEW = "LEAD_VIEW",
    LEAD_CREATE = "LEAD_CREATE",
    LEAD_EDIT = "LEAD_EDIT",
    LEAD_EDIT_PHONE = "LEAD_EDIT_PHONE",
    LEAD_DELETE = "LEAD_DELETE",
    LEAD_EXPORT = "LEAD_EXPORT",
    LEAD_ASSIGN = "LEAD_ASSIGN",
    USER_VIEW = "USER_VIEW",
    USER_CREATE = "USER_CREATE",
    USER_EDIT = "USER_EDIT",
    USER_DELETE = "USER_DELETE",
    REPORT_VIEW = "REPORT_VIEW",
    REMINDER_CREATE = "REMINDER_CREATE",
    REMINDER_EDIT = "REMINDER_EDIT",
    NOTE_CREATE = "NOTE_CREATE",
    NOTE_VIEW = "NOTE_VIEW"

}