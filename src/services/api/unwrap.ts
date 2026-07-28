import type { ApiResponse } from "@/shared/types/api";

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data === null) {
    throw new Error(response.text || "Erro na requisição");
  }

  return response.data;
}