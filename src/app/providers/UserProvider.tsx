import { createContext, useContext, useState, type ReactNode } from "react";
import { createUser, getAllUsers, type CreateUserDTO } from "@/services/users/userService";
import type { User } from "@/shared/types/UserTypes";

interface UserContextType {
    users: User[] | null;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>

    fetchUsers: () => Promise<void>

    CreateUser: (userDTO: CreateUserDTO) => Promise<void>

    updateUser: (user: User) => Promise<void>
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[] | null>(null)

    async function fetchUsers() {
        const data = await getAllUsers();

        setUsers(data.content);
    }

    async function CreateUser(userDTO: CreateUserDTO) {
        await createUser(userDTO)
        await fetchUsers();
    }

    async function updateUser(user: User) {
        await updateUser(user);
        await fetchUsers();
    }

    return (
        <UserContext.Provider
            value={{
                CreateUser,
                fetchUsers,
                setUsers,
                updateUser,
                users
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