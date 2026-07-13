import type { Lead } from "@/shared/types/LeadType"
import type { User } from "@/shared/types/UserTypes"

export enum NotificationType {
    REMINDER = "REMINDER",
    NEW_LEAD = "NEW_LEAD",
}

export interface AppNotification {
    id: string,
    user: User,
    createdAt: Date,
    lead?: Lead;
    alarmAt?: Date;
    type: NotificationType,
    read: boolean,
}

export interface CreateNotificationDTO {
    leadId: string,
    userId: string,
    type: NotificationType,
    alarmAt?: string,
}

export interface readDTO {
    read: boolean
}