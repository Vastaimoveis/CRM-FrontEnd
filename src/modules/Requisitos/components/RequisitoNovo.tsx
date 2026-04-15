import { useState } from "react";


export default function RequisitoNovo() {
    const [mensagem, setMensagem] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);


    async function handleRespond() {
        if (!mensagem.trim()) return;

        setLoading(true);
        await onRespond(requisito.id, mensagem);
        setLoading(false);
        setResposta("");
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl w-162.5 max-h-[90vh] flex flex-col">

                {/* HEADER */}
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        header
                    </div>

                    <button onClick={ } className="text-gray-500 rounded-2xl">
                        ✕
                    </button>
                </div>

                {/* CONTEÚDO */}
                <div className="p-6 flex-1 overflow-y-auto space-y-4">

                    <div>
                        <h3 className="text-sm font-semibold mb-1">Mensagem</h3>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                            Escreva a mensagem
                        </p>
                    </div>

                    {/* RESPOSTA */}
                    <div>
                        <h3 className="text-sm font-semibold mb-1">
                            Responder
                        </h3>
                        <textarea
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            className="w-full border rounded p-2 min-h-25"
                            placeholder="Digite sua resposta..."
                        />
                    </div>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t flex justify-between">

                    <button
                        onClick={handleMarkAsRead}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Marcar como lido
                    </button>

                    <button
                        onClick={handleRespond}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Enviando..." : "Responder"}
                    </button>

                </div>
            </div>
        </div>
    );
}
    )
}