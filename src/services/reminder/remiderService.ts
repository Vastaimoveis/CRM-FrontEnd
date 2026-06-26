import type { ApiResponse } from "@/shared/types/api";
import type { Reminder, CreateReminderDTO, readDTO } from "./reminderTypes";
import { api } from "../api/api";

export async function getAlertsByUserId(id: string){
    const response = await api.get<ApiResponse<Reminder[]>>(`reminders/${id}`)
    return response.data
}

export async function postReminder(CreateAlertDTO: CreateReminderDTO){
    const response = await api.post<ApiResponse<Reminder>>(`reminders`, CreateAlertDTO);

    return response.data
}

export async function patchReminder(id:string, read: readDTO) {
    const response = await api.patch<
    ApiResponse<Reminder>
    >(`/reminders/${id}`, read);

    return response.data
}

export async function deleteReminder(id: string){
    await api.delete(`/reminders/${id}`)
}