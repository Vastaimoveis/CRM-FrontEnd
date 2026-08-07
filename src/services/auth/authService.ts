import type { ApiResponse } from "@/shared/types/api";
import { api } from "../api/api";
import type { LoginRequestDTO, LoginResponseDTO } from "./authTypes";

export async function loginRequest(dto: LoginRequestDTO): Promise<ApiResponse<LoginResponseDTO>> {
  try {
    const response = await api.post<ApiResponse<LoginResponseDTO>>(
      "/auth/login",
      dto
    );


    return response.data;

  } catch (error: any) {

    if (error.response?.data) {
      return error.response.data;
    }

    return {
      success: false,
      text: "Não foi possível conectar ao servidor.",
      data: null,
    };
  }
}