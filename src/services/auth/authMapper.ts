import type { User } from "../../shared/types/UserTypes";
import type { LoginResponseDTO } from "./authTypes";

export function mapLoginResponseToUser(
    response: LoginResponseDTO
): User {
    return {
        id: response.user.id,
        nome: response.user.nome,
        email: response.user.email,
        telefone: response.user.telefone,
        role: response.user.role,
        regiao: response.user.regiao,
    };
}