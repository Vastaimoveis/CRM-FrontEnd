import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createUser, getAllUsers, type CreateUserDTO, updateUser as updateUserService, getCorretores } from "@/services/users/userService";
import type { User } from "@/shared/types/UserTypes";
import capitalizeWords from "@/shared/utils/capitalizeWords";
import type { FollowUpCorretorOption } from "@/modules/Follow-up/components/followBoard/FollowFilter/FollowFilter";

interface UserContextType {
    users: User[] | null;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
    corretores: FollowUpCorretorOption[];
    loading: boolean;
    fetchUsers: () => Promise<void>;
    loadCorretores: () => Promise<void>;
    CreateUser: (userDTO: CreateUserDTO) => Promise<void>;
    updateUser: (user: User) => Promise<void>;
    getUserById: (id: string) => User | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
    const [users, setUsers] = useState<User[] | null>(null)
    const [loading, setLoading] = useState(true);
    const [corretores, setCorretores] =
        useState<FollowUpCorretorOption[]>([]);

    const fetchUsers = useCallback(async () => {

        const data = await getAllUsers();

        setUsers(data.content.map((user) => (
            {
                ...user, nome: capitalizeWords(user.nome)
            })));


    }, []
    )

    const CreateUser = useCallback(async (userDTO: CreateUserDTO) => {
        const userCreated = await createUser(userDTO)
        setUsers(prev => prev ? [...prev, userCreated] : [userCreated]);
    },
        []
    )

    const loadCorretores = useCallback(async () => {
        try {
            const response = await getCorretores();

            const options: FollowUpCorretorOption[] = response.map(
                corretor => ({
                    id: corretor.id,
                    nome: capitalizeWords(corretor.nome)
                })
            );

            setCorretores(options);

        } catch (error) {
            console.error(
                "[UserProvider] Erro ao carregar corretores:",
                error
            );

            throw error;
        }
    }, []);

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


    const getUserById = useCallback(
        (id: string) =>
            users?.find(user => user.id === id) ?? null,
        [users]
    );


    useEffect(() => {
        async function load() {
            setLoading(true);

            try {
                await fetchUsers();
            } catch (error) {
                console.error(
                    "[UserProvider] Erro ao carregar usuários:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        void load();

    }, [fetchUsers]);


    const value = useMemo(() => ({
        CreateUser,
        corretores,
        loadCorretores,
        getUserById,
        fetchUsers,
        setUsers,
        updateUser,
        users,
        loading
    }), [
        CreateUser,
        corretores,
        loadCorretores,
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
        throw new Error(
            "useUsers deve ser usado dentro de UserProvider"
        );
    }

    return context;
}