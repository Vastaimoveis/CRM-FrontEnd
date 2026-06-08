import { RegioesEnum, UserRoles } from "@/shared/types/UserTypes";
import { UserTable } from "../components/CorretoresTable";
import { useEffect, useState } from "react";
import { useHooksCorretores } from "../hooks/useHooksCorretores";
import { validatePhone } from "@/shared/utils/validatePhone";
import { useToast } from "@/app/providers/ToastProvider";
import { useUsers } from "@/app/providers/UserProvider";
import { Eye, EyeOff } from "lucide-react";
import capitalizeWords from "@/shared/utils/capitalizeWords";

export default function CorretoresPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();
    const {
        form,
        setForm,
        handleChange,
        handleRoleChange,
        loading,
        resetForm,
        setLoading
    } = useHooksCorretores();
    const { users, CreateUser, fetchUsers } = useUsers();

    const [showPassword, setShowPassword] = useState(false);
    useEffect(() => {
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

            setForm(prev => ({
                ...prev,
                nome: capitalizeWords(prev.nome)
            }))
            await CreateUser(form);
            resetForm();
            setIsModalOpen(false);
            showToast("User criado com sucesso", "success");
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

                        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">

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
                                type="tel"
                                name="telefone"
                                placeholder="Telefone"
                                value={form.telefone}
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

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Senha"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>


                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Região
                                </label>
                                <select
                                    name="regiao"
                                    value={form.regiao}
                                    defaultValue={RegioesEnum.CURITIBA}
                                    className="w-full border rounded-lg px-3 py-2">

                                    <option key={RegioesEnum.CURITIBA} value={RegioesEnum.CURITIBA}>{RegioesEnum.CURITIBA}</option>

                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Cargo
                                </label>
                                <select
                                    name="role"
                                    value={form.role}
                                    onChange={(e) =>
                                        handleRoleChange(e.target.value as UserRoles)
                                    }
                                    className="w-full border rounded-lg px-3 py-2">
                                    {Object.values(UserRoles).map((role) =>
                                        <option key={role} value={role}>{role}</option>
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