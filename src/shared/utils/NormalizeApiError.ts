import axios from "axios";
import { ApiError } from "../types/ApiError";

export function normalizeApiError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (axios.isAxiosError(error)) {
        const response = error.response?.data;

        return new ApiError(
            response?.message || "Erro na comunicação com o servidor.",
            response?.errorCode ?? null
        );
    }

    if (error instanceof Error) {
        return new ApiError(error.message);
    }

    return new ApiError("Ocorreu um erro inesperado.");
}