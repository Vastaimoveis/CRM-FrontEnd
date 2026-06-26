import type { Lead } from "@/shared/types/LeadType"
import type { User } from "@/shared/types/UserTypes"

export interface Reminder {
    id: string,
    lead: Lead,
    user: User,
    createdAt: Date,
    alarmAt: Date,
    read: boolean,
}

export interface CreateReminderDTO {
    alarmAt: string,
    leadId: string,
    userId: string,
}

export interface readDTO {
    read: boolean
}