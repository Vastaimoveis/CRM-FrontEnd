
import axios from "axios";

import type { ApiResponse } from "@/shared/types/api";
import { api } from "../api/api";
import type { LoginRequestDTO, LoginResponseDTO } from "./authTypes";

export async function loginRequest(
    dto: LoginRequestDTO
): Promise<ApiResponse<LoginResponseDTO>> {
    try {
        const response = await api.post<ApiResponse<LoginResponseDTO>>(
            "/auth/login",
            dto
        );

        return response.data;

    } catch (error: unknown) {

        if (axios.isAxiosError<ApiResponse<LoginResponseDTO>>(error)) {
            if (error.response?.data) {
                return error.response.data;
            }
        }

        return {
            success: false,
            message: "Não foi possível conectar ao servidor.",
            data: null,
        };
    }
}
