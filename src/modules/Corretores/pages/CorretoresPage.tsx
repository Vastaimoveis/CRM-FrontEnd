import { RegioesEnum} from "@/shared/types/UserTypes";
import { UserTable } from "../components/CorretoresTable";
import { useEffect, useState } from "react";
import { useHooksCorretores } from "../hooks/useHooksCorretores";
import { validatePhone } from "@/shared/utils/validatePhone";
import { useToast } from "@/app/providers/ToastProvider";
import { useUsers } from "@/app/providers/UserProvider";

export default function CorretoresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();
    const {
        form,
        handleChange,
        loading,
        resetForm,
        setLoading
    } = useHooksCorretores();
    const { users, CreateUser, fetchUsers} = useUsers();

    useEffect(()=>{
        fetchUsers();
    }, [])

    function handleClose() {
        setIsModalOpen(false);
        resetForm();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            if (!validatePhone(form.telefone)) {
                showToast("Telefone inválido", "error");
                return;
            }

            await CreateUser(form);
            resetForm();
            showToast("User criado com sucesso", "success");
            setIsModalOpen(false);
        } catch {
            showToast("Erro ao criar user", "error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-semibold">
                        Lista de Usuários
                    </h1>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Novo Corretor
                    </button>
                </div>

                {users == null ? (
                    <p>Nenhum corretor encontrado</p>
                ) : (
                    <UserTable users={users} />
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Novo Corretor
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                type="text"
                                name="nome"
                                placeholder="Nome"
                                value={form.nome}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={handleChange}

                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <input
                                type="password"
                                name="password"
                                placeholder="password"
                                value={form.password}
                                onChange={handleChange}

                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <input
                                type="tel"
                                name="telefone"
                                placeholder="Telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                required
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Região
                                </label>
                                <select
                                    name="regiao"
                                    value={form.regiao}
                                    className="w-full border rounded-lg px-3 py-2">
                                    {Object.values(RegioesEnum).map((regiao) =>
                                        <option key={regiao} value={regiao}>{regiao}</option>
                                    )}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => handleClose()}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2 bg-black text-white rounded-lg hover:opacity-80 transition disabled:opacity-50"
                                >
                                    {loading ? "Salvando..." : "Salvar"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}