import { RegioesEnum, UserRoles, type User } from "@/shared/types/UserTypes";
import { UserTable } from "../components/CorretoresTable";


const mockUsers: User[] = [
    { id: "1", name: "João Silva", email: "joao@email.com", telefone: "9823717872", role: UserRoles.CORRETOR, regiao: RegioesEnum.CURITIBA },
    { id: "2", name: "Maria Souza", email: "maria@email.com", telefone: "942137872", role: UserRoles.CORRETOR, regiao: RegioesEnum.CURITIBA },
    { id: "3", name: "Carlos Lima", email: "carlos@email.com", telefone: "9823999872", role: UserRoles.CORRETOR, regiao: RegioesEnum.CURITIBA },
];

export default function CorretoresPage() {
    return (
        <>
            <div>
                <div className="p-6">
                    <h1 className="text-2xl font-semibold mb-4">Lista de Usuários</h1>

                    <UserTable users={mockUsers} />
                </div>
            </div>
        </>
    )
}