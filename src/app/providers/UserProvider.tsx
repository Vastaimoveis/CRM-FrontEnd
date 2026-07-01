import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createUser, getAllUsers, type CreateUserDTO, updateUser as updateUserService } from "@/services/users/userService";
import type { User } from "@/shared/types/UserTypes";
import capitalizeWords from "@/shared/utils/capitalizeWords";

interface UserContextType {
    users: User[] | null;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
    loading: boolean;
    fetchUsers: () => Promise<void>;
    CreateUser: (userDTO: CreateUserDTO) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUserById: (id: string) => User | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        const data = await getAllUsers();

        setUsers(data.content.map((user) => (
            {...user, nome: capitalizeWords(user.nome)

            })));
}

async function CreateUser(userDTO: CreateUserDTO) {
    await createUser(userDTO)
    await fetchUsers();
}

async function updateUser(user: User) {
    await updateUserService(user);
    await fetchUsers();
}

useEffect(() => {
    loadUsers();
}, []);

async function loadUsers() {
    await fetchUsers();
    setLoading(false);
}

const getUserById = useCallback(
    (id: string) => {
        return users?.find(user => user.id === id) ?? null;
    },
    [users]
);

return (
    <UserContext.Provider
        value={{
            CreateUser,
            getUserById,
            fetchUsers,
            setUsers,
            updateUser,
            users,
            loading
        }}
    >
        {children}
    </UserContext.Provider>
)
}

export function useUsers() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useFunnel deve ser usado dentro de FunnelProvider")
    }

    return context;
}