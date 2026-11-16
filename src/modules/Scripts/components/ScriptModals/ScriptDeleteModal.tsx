import { AlertTriangle, X } from "lucide-react";

import type { Script } from "@/services/script/ScriptTypes";

interface DeleteScriptModalProps {
    script: Script;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    loading: boolean;
}

export default function ScriptDeleteModal({
    script,
    onClose,
    onConfirm,
    loading,
}: DeleteScriptModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose();
                }
            }}
        >
            <section
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-script-title"
                className="w-full max-w-md rounded-2xl bg-white shadow-xl"
            >
                <header className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                    <h2
                        id="delete-script-title"
                        className="text-lg font-semibold text-gray-800"
                    >
                        Excluir script
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Fechar modal"
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        <X size={20} />
                    </button>
                </header>

                <div className="p-6 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                        <div className="shrink-0 p-2 rounded-full bg-red-50 text-red-600">
                            <AlertTriangle size={22} />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-gray-800">
                                Tem certeza que deseja excluir este script?
                            </p>

                            <p className="text-sm text-gray-500">
                                <strong>{script.title}</strong>
                            </p>

                            <p className="text-sm text-gray-500">
                                Essa ação não poderá ser desfeita.
                            </p>
                        </div>
                    </div>

                    <footer className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="h-11 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className="h-11 px-5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium text-white transition disabled:opacity-60"
                        >
                            {loading ? "Excluindo..." : "Excluir script"}
                        </button>
                    </footer>
                </div>
            </section>
        </div>
    );
}