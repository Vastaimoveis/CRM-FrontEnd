import type { Lead } from "@/shared/types/LeadType";
import LeadsPreviewTable from "./LeadsPreviewTable";

interface Props {
    leads: Lead[];
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LeadsPreviewModal({
    leads,
    onConfirm,
    onCancel,
}: Props) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-200 max-h-[90vh] flex flex-col">
                <h2 className="text-xl font-bold mb-4">
                    Preview de Leads ({leads.length})
                </h2>

                <LeadsPreviewTable leads={leads} />

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-200"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-blue-600 text-white"
                    >
                        Confirmar Importação
                    </button>
                </div>
            </div>
        </div>
    );
}