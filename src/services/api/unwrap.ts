
import type { ApiResponse } from "@/shared/types/api";
import { ApiError } from "@/shared/types/ApiError";

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
    if (!response || response.success !== true) {
        console.error("[API RESPONSE INVÁLIDA]", {
            responseType: typeof response,
            responseIsArray: Array.isArray(response),
            responseKeys:
                response && typeof response === "object"
                    ? Object.keys(response)
                    : [],
            success: response?.success,
            message: response?.message,
            errorCode: response?.errorCode,
        });

        throw new ApiError(
            response?.message || "Erro na requisição",
            response?.errorCode ?? null
        );
    }

    if (response.data === null) {
        console.error("[API DATA AUSENTE]", response);

        throw new ApiError(
            "A resposta da API não contém os dados esperados.",
            response.errorCode ?? null
        );
    }

    return response.data;
}
