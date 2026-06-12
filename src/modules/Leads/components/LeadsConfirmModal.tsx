import { useState } from "react";

interface LeadsConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    requireNote?: boolean;
    onConfirm: (note?: string) => void | Promise<void>;
    onCancel: () => void;
}

export default function LeadsConfirmModal({
    title,
    message,
    confirmLabel = "Confirmar",
    requireNote = false,
    onConfirm,
    onCancel,
}: LeadsConfirmModalProps) {

    const [note, setNote] = useState("");

    const handleConfirm = () => {
        if (requireNote && !note.trim()) {
            return;
        }

        onConfirm(note.trim());
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">

                <h2 className="text-lg font-semibold mb-2">
                    {title}
                </h2>

                <p className="text-gray-600 mb-4">
                    {message}
                </p>

                {requireNote && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Motivo do encerramento *
                        </label>

                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            placeholder="Descreva o motivo do encerramento do lead..."
                            className="w-full border rounded-lg p-3 resize-none"
                        />

                        {!note.trim() && (
                            <p className="text-xs text-red-500 mt-1">
                                Este campo é obrigatório.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={requireNote && !note.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}