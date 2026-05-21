import type { User } from "../../shared/types/UserTypes";
import type { LoginResponseDTO } from "./authTypes";

export function mapLoginResponseToUser(
    response: LoginResponseDTO
): User {
    return {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        telefone: response.data.user.telefone,
        role: response.data.user.role,
        regiao: response.data.user.regiao,
    };
}