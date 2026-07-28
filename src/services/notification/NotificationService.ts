import type { ApiResponse } from "@/shared/types/api";
import type {
  AppNotification,
  CreateNotificationDTO,
  readDTO
} from "./NotificationTypes";
import { api } from "../api/api";
import { unwrapApiResponse } from "../api/unwrap";

export async function getNotificationsByUserId(
  id: string
): Promise<AppNotification[]> {

  const response = await api.get<ApiResponse<AppNotification[]>>(
    `/notifications/${id}`
  );

  return unwrapApiResponse(response.data);
}

export async function postNewNotification(
  dto: CreateNotificationDTO
): Promise<AppNotification> {

  const response = await api.post<ApiResponse<AppNotification>>(
    `/notifications`,
    dto
  );

  return unwrapApiResponse(response.data);
}

export async function patchReadNotification(
  id: string,
  read: readDTO
): Promise<AppNotification> {

  const response = await api.patch<ApiResponse<AppNotification>>(
    `/notifications/${id}`,
    read
  );

  return unwrapApiResponse(response.data);
}

export async function deleteNotification(
  id: string
): Promise<void> {

  const response = await api.delete<ApiResponse<null>>(
    `/notifications/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.text);
  }
}