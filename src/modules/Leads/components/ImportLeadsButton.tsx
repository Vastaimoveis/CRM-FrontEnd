import { useState } from "react";
import { parseExcel } from "../utils/importLeadsFromExcel";
import { useLeads } from "@/app/providers/LeadProvider";
import LeadsPreviewModal from "./LeadsPreviewModal";
import type { Lead } from "@/shared/types/LeadType";

export default function ImportLeadsButton() {
  const { importLeads } = useLeads();

  const [previewLeads, setPreviewLeads] = useState<Lead[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const leads = await parseExcel(file);
    setFileName(file.name);
    setPreviewLeads(leads);
    setShowModal(true);
  }

  function handleConfirm() {
    importLeads(previewLeads);
    setShowModal(false);
    setPreviewLeads([]);
  }

  function handleCancel() {
    setShowModal(false);
    setPreviewLeads([]);
  }

  return (
    <div className=" text-white px-4 py-2 rounded w-fit ">
      <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
        {fileName || "Importar Leads"}
        <input className="hidden" type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />

        {showModal && (
          <LeadsPreviewModal
            leads={previewLeads}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </label>
    </div>
  );
}