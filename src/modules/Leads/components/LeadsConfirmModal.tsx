interface LeadsConfirmModalProps {
    title: string;
    message: string;
    confirmLabel?: string;
    status?: boolean;
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

export default function LeadsConfirmModal({
    title,
    message,
    status = false,
    confirmLabel = "Confirmar",
    onConfirm,
    onCancel,

}: LeadsConfirmModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">
                    {title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                
                
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}