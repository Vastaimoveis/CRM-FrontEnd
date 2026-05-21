import { api } from "../api/api";
import type { LoginRequestDTO, LoginResponseDTO } from "./authTypes";

export async function loginRequest(data: LoginRequestDTO): Promise<LoginResponseDTO> {
  const response = await api.post<LoginResponseDTO>(
    "/auth/login",
    data
  );

  return response.data;
}