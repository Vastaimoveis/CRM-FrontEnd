import type { Lead } from "@/types/LeadType";
import LeadsPreviewTable from "./LeadsPreviewTable";

interface Props {
  leads: Lead[];
  title?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function LeadsPreviewModal({
  leads,
  title = "Preview de Leads",
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-200 max-h-[90vh] flex flex-col">

        <h2 className="text-xl font-bold mb-4">
          {title} ({leads.length})
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
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}