import Permission from "@/shared/permissions/Permission";
import { RegioesEnum, UserRoles, type User } from "@/shared/types/UserTypes";
import { useState } from "react";
import RequisitosSearchDropdown from "./RequisitoSearchDropdown";

interface props {
    onSend: (corretor: User, assunto: string, message: string) => Promise<void>;
    onClose: () => void;

}

const corretores: User[] = [
    { id: "2103", nome: "João da Silva", email: "joao@email.com", telefone: "41 999929392", regiao: RegioesEnum.CURITIBA, role: UserRoles.CORRETOR },
    { id: "2104", nome: "Maria Souza", email: "Maria@email.com", telefone: "41 988829392", regiao: RegioesEnum.CURITIBA, role: UserRoles.CORRETOR },
    { id: "2105", nome: "Carlos Junior", email: "Carlos@email.com", telefone: "41 977729392", regiao: RegioesEnum.CURITIBA, role: UserRoles.CORRETOR },
];

export default function RequisitoNovo({ onSend, onClose }: props) {
    const [assunto, setAssunto] = useState<string>("");
    const [mensagem, setMensagem] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [corretor, setCorretor] = useState<User | null>(null);

    async function handleSend() {
        if (!mensagem.trim()) return;
        if (!assunto.trim()) return;
        if (!corretor) return;


        setLoading(true);
        await onSend(corretor, assunto, mensagem);
        setLoading(false);
        setMensagem("");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-162.5 max-h-[90vh] flex flex-col">

                {/* HEADER */}
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        Nova Mensagem
                    </div>

                    <button onClick={onClose} className="text-gray-500 rounded-2xl">
                        ✕
                    </button>
                </div>

                {/* CONTEÚDO */}
                <div className="p-6 flex-1 overflow-y-auto space-y-4">

                    <div>
                        <Permission allowed={[UserRoles.GERENTE]}>
                            <h3 className="text-sm font-semibold mb-1"> Escolha para qual corretor enviar:</h3>
                            <RequisitosSearchDropdown
                                items={corretores}
                                placeholder="Selecione um corretor"
                                onSelect={(item) => {
                                    console.log("Selecionado:", item)
                                    setCorretor(item);
                                }}
                            />
                        </Permission>

                    </div>

                    {/* ASSUNTO */}
                    <div>
                        <h3 className="text-sm font-semibold mb-1">
                            Assunto
                        </h3>
                        <input
                            type="text"
                            onChange={(e) => setAssunto(e.target.value)}
                            className="w-full border rounded p-2 "
                            placeholder="Digite o assunto"
                        />
                    </div>


                    {/* RESPOSTA */}
                    <div>
                        <h3 className="text-sm font-semibold mb-1">
                            Mensagem
                        </h3>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="w-full border rounded p-2 min-h-25"
                            placeholder="Digite a mensagem"
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex justify-between">

                    <button
                        onClick={handleSend}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </button>

                </div>
            </div>
        </div>
    );
}