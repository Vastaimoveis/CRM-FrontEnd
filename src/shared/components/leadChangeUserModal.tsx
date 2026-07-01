import { useMemo, useState } from "react";
import type { User } from "@/shared/types/UserTypes";
import type { Lead } from "../types/LeadType";
import { useUsers } from "@/app/providers/UserProvider";

interface LeadChangeUserModalProps {
    lead: Lead;
    users: User[] | null;
    onClose: () => void;
    onSave: (leadId: string, userId: string) => Promise<void>;
}

export default function LeadChangeUserModal({
    lead,
    users,
    onClose,
    onSave
}: LeadChangeUserModalProps) {
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const { getUserById } = useUsers();
    const currentUser = getUserById(lead.userId);
    const filteredUsers = useMemo(() => {
        const value = search.toLowerCase();

        return users?.filter(
            (user) =>
                user.nome.toLowerCase().includes(value) ||
                user.email.toLowerCase().includes(value)
        );
    }, [users, search]);

    const handleSave = async () => {
        if (!selectedUser) return;

        await onSave(lead.id, selectedUser.id);

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-105 rounded-xl bg-white shadow-xl">
                <div className="border-b px-5 py-4">
                    <h2 className="text-lg font-semibold">
                        Alterar responsável por {lead.nome}
                    </h2>
                    {currentUser ?
                        <h3>
                            Responsável atual: {currentUser.nome}
                        </h3>
                        :
                        <h3>
                            Nenhum responsável atualmente...
                        </h3>
                    }
                </div>

                <div className="p-5">
                    <input
                        type="text"
                        placeholder="Pesquisar usuário..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="mb-4 w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500"
                    />

                    <div className="max-h-72 overflow-y-auto rounded-md border">
                        {filteredUsers ? (
                            filteredUsers.map((user) => (
                                <button
                                    key={user.id}
                                    type="button"
                                    onClick={() => setSelectedUser(user)}
                                    className={`flex w-full items-center justify-between border-b px-4 py-3 text-left hover:bg-gray-50 last:border-b-0 ${selectedUser?.id === user.id
                                        ? "bg-blue-50"
                                        : ""
                                        }`}
                                >
                                    <div>
                                        <p className="font-medium">
                                            {user.nome}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {user.email}
                                        </p>
                                    </div>

                                    {selectedUser?.id === user.id && (
                                        <span className="text-blue-600 font-semibold">
                                            ✓
                                        </span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-gray-500">
                                Nenhum usuário encontrado.
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t px-5 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        disabled={!selectedUser}
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}