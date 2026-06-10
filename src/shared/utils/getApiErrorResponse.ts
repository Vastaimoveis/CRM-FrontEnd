import { AxiosError } from "axios";

export function getApiErrorMessage(error: unknown): string {

    if (error instanceof AxiosError) {
        return (
            error.response?.data?.message ||
            error.message ||
            "Erro inesperado"
        );
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Erro inesperado";
}