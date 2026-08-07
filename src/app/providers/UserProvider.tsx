import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createUser, getAllUsers, type CreateUserDTO, updateUser as updateUserService } from "@/services/users/userService";
import type { User } from "@/shared/types/UserTypes";
import capitalizeWords from "@/shared/utils/capitalizeWords";
import { useAuth } from "./AuthProvider";

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
    const { loadingAuth, isCorretor } = useAuth();

    const fetchUsers = useCallback(async () => {

        const data = await getAllUsers();

        setUsers(data.content.map((user) => (
            {
                ...user, nome: capitalizeWords(user.nome)
            })));
    }, [
        getAllUsers,
        setUsers,

    ]
    )

    const CreateUser = useCallback(async (userDTO: CreateUserDTO) => {
        const userCreated = await createUser(userDTO)
        setUsers(prev => prev ? [...prev, userCreated] : [userCreated]);
    },
        [
            createUser,
            fetchUsers
        ]
    )

    const updateUser = useCallback(async (user: User) => {
        const userUpdated = await updateUserService(user);
        if (!userUpdated) return;
        setUsers(prev => {
            if (!prev) return null;
            return prev?.map(
                currentUser =>
                    currentUser.id === userUpdated.id
                        ? userUpdated
                        : currentUser)
        })
    }, [
        updateUserService,
        fetchUsers
    ])

    useEffect(() => {
        if(loadingAuth) return;

        if(isCorretor) return;

        async function load() {
            try {
                await fetchUsers();
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [fetchUsers]);

    const getUserById = useCallback(
        (id: string) =>
            users?.find(user => user.id === id) ?? null,
        [users]
    );

    const value = useMemo(() => ({
        CreateUser,
        getUserById,
        fetchUsers,
        setUsers,
        updateUser,
        users,
        loading
    }), [
        CreateUser,
        getUserById,
        fetchUsers,
        setUsers,
        updateUser,
        users,
        loading
    ])

    return (
        <UserContext.Provider
            value={value}
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