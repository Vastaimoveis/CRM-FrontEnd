import type { LoginRequest, LoginResponse } from "../shared/types/authTypes";

const API_URL = "http://localhost:8080/api/auth";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Credenciais inválidas");
  }

  return response.json();
}