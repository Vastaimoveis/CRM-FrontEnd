import type { ApiResponse } from "@/shared/types/api";
import type { AppNotification, CreateNotificationDTO, readDTO } from "./NotificationTypes";
import { api } from "../api/api";

export async function getNotificationsByUserId(id: string) {
    const response = await api.get<ApiResponse<AppNotification[]>>(`/notifications/${id}`);
    return response.data;
}

export async function postNewNotification(dto: CreateNotificationDTO) {
    const response = await api.post<ApiResponse<AppNotification>>(`/notifications`, dto);
    return response.data;
}

export async function patchReadNotification(id: string, read: readDTO){
    const response = await api.patch<ApiResponse<AppNotification>>(`/notifications/${id}`, read);
    return response.data;
}

export async function deleteNotification(id: string){
    const response = await api.delete<ApiResponse<null>>(`/notifications/${id}`)
    return response;
}