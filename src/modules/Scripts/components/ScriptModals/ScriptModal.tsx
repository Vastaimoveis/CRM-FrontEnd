
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

import {
    ScriptCategories,
    ScriptCategoryLabels,
    type CreateScript,
} from "@/services/script/ScriptTypes";

interface CreateScriptModalProps {
    onClose: () => void;
    onSubmit: (data: CreateScript) => Promise<void>;
    loading: boolean;
}

export default function CreateScriptModal({
    onClose,
    onSubmit,
    loading,
}: CreateScriptModalProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<ScriptCategories | "">("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!title.trim()) {
            setError("Informe um título para o script.");
            return;
        }

        if (!category) {
            setError("Selecione uma categoria.");
            return;
        }

        if (!message.trim()) {
            setError("Informe a mensagem do script.");
            return;
        }

        try {
            await onSubmit({
                title: title.trim(),
                category: category,
                message: message.trim(),
            });
        } catch {
            setError("Não foi possível criar o script. Tente novamente.");
        }
    }

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/50 p-4
            "
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-script-title"
                className="
                    w-full max-w-xl
                    max-h-[90vh] overflow-y-auto
                    rounded-2xl bg-white shadow-xl
                "
            >
                <header className="
                    flex items-center justify-between
                    px-6 py-5 border-b border-gray-200
                ">
                    <div className="flex flex-col gap-1">
                        <h2
                            id="create-script-title"
                            className="text-lg font-semibold text-gray-800"
                        >
                            Criar novo script
                        </h2>

                        <p className="text-sm text-gray-500">
                            Cadastre uma mensagem para utilizar no atendimento.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Fechar modal"
                        className="
                            p-2 rounded-lg text-gray-500
                            hover:bg-gray-100 transition
                            disabled:opacity-50
                        "
                    >
                        <X size={20} />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="script-title"
                            className="text-sm font-medium text-gray-700"
                        >
                            Título
                        </label>

                        <input
                            id="script-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={150}
                            placeholder="Ex.: Apresentação inicial"
                            disabled={loading}
                            className="
                                w-full h-11 px-3 rounded-lg
                                border border-gray-300 outline-none
                                text-sm text-gray-700
                                focus:border-green-500focus:ring-1 focus:ring-green-500
                                disabled:bg-gray-100
                            "
                        />

                        <span className="text-xs text-gray-400 text-right">
                            {title.length}/150
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="script-category"
                            className="text-sm font-medium text-gray-700"
                        >
                            Categoria
                        </label>

                        <select
                            id="script-category"
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value as ScriptCategories | "")
                            }
                            disabled={loading}
                            className="
                                w-full h-11 px-3 rounded-lg
                                border border-gray-300 outline-none
                                text-sm text-gray-700 bg-white
                                focus:border-green-500focus:ring-1 focus:ring-green-500
                                disabled:bg-gray-100
                            "
                        >
                            <option value="" disabled>
                                Selecione uma categoria
                            </option>

                            {Object.values(ScriptCategories).map((item) => (
                                <option key={item} value={item}>
                                    {ScriptCategoryLabels[item]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label
                            htmlFor="script-message"
                            className="text-sm font-medium text-gray-700"
                        >
                            Mensagem
                        </label>

                        <textarea
                            id="script-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            maxLength={5000}
                            rows={7}
                            placeholder="Digite aqui a mensagem que será utilizada..."
                            disabled={loading}
                            className="
                                w-full p-3 rounded-lg resize-y
                                border border-gray-300 outline-none
                                text-sm text-gray-700
                                focus:border-green-500focus:ring-1 focus:ring-green-500
                                disabled:bg-gray-100
                            "
                        />

                        <span className="text-xs text-gray-400 text-right">
                            {message.length}/5000
                        </span>
                    </div>

                    {error && (
                        <p role="alert" className="text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    <footer className="
                        flex flex-col-reverse sm:flex-row
                        justify-end gap-3 pt-2
                    ">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="
                                h-11 px-5 rounded-lg
                                border border-gray-300
                                text-sm font-medium text-gray-600
                                hover:bg-gray-50 transition
                                disabled:opacity-50
                            "
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                h-11 px-5 rounded-lg
                                bg-green-500 hover:bg-green-800
                                text-sm font-medium text-white
                                transition disabled:opacity-60
                            "
                        >
                            {loading ? "Criando..." : "Criar script"}
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
