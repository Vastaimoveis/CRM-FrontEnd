
import axios from "axios";
import { ApiError } from "../types/ApiError";

const DEFAULT_ERROR_MESSAGE = "Ocorreu um erro inesperado.";

export function getApiErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        return error.message;
    }

    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        if (
            responseData &&
            typeof responseData === "object" &&
            "message" in responseData &&
            typeof responseData.message === "string"
        ) {
            return responseData.message;
        }

        if (!error.response) {
            return "Não foi possível conectar ao servidor.";
        }

        return "Erro na comunicação com o servidor.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return DEFAULT_ERROR_MESSAGE;
}
