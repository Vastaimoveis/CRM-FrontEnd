import { useSearchParams } from "react-router-dom";

import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";

import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { useLeadsFilter } from "../hooks/useLeadsFilter";
import { useLeadsPagination } from "../hooks/useLeadsPagination";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import LeadsPreviewModal from "../components/LeadsPreviewModal";
import { useState } from "react";
import { parseExcel } from "../utils/importLeadsFromExcel";
import type { Lead } from "@/types/LeadType";


const ITEMS_PER_PAGE = 20;

export default function Leads() {
    const { leads, updateLeadStatus, importLeads } = useLeads();
    const [searchParams, setSearchParams] = useSearchParams();
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewType, setPreviewType] = useState<"export" | "import" | null>(null);
    const [importedLeads, setImportedLeads] = useState<Lead[]>([]);
    const statusParam = searchParams.get("status") as LeadStatus | null;
    const searchParam = searchParams.get("search") || "";
    const currentPage = Number(searchParams.get("page")) || 1;

    function updateParams(newParams: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (!value) params.delete(key);
            else params.set(key, value);
        });

        setSearchParams(params);
    }

    async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const parsedLeads = await parseExcel(file);

        setImportedLeads(parsedLeads);
        setPreviewType("import");
    }

    const filteredLeads = useLeadsFilter({
        leads,
        status: statusParam,
        search: searchParam,
    });

    function handleDelete() {
        //todo: open modal and delete Lead
        
    }

    const { paginatedLeads, totalPages } = useLeadsPagination({
        leads: filteredLeads,
        currentPage,
        itemsPerPage: ITEMS_PER_PAGE,
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Leads</h1>

                    <div className="text-sm text-gray-500">
                        {filteredLeads.length} resultado(s)
                    </div>
                </div>
                <div className="flex justify-between">
                    <LeadsFilter
                        status={statusParam}
                        search={searchParam}
                        onStatusChange={(value) =>
                            updateParams({
                                status: value || null,
                                page: null,
                            })
                        }
                        onSearchChange={(value) =>
                            updateParams({
                                search: value || null,
                                page: null,
                            })
                        }
                    />

                    <div className="flex gap-2">
                        <button
                            onClick={() => setPreviewType("export")}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800"
                        >
                            Exportar Excel
                        </button>

                        <input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            id="import-input"
                            onChange={handleFileImport}
                            onClick={() => setPreviewType("import")}
                        />

                        <label
                            htmlFor="import-input"
                            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800"
                        >
                            Importar Excel
                        </label>
                    </div>

                    {previewType && (
                        <LeadsPreviewModal
                            leads={previewType === "import" ? importedLeads : filteredLeads}
                            title={
                                previewType === "export"
                                    ? "Pré-visualização do Export"
                                    : "Pré-visualização do Import"
                            }
                            confirmLabel={
                                previewType === "export"
                                    ? "Exportar Excel"
                                    : "Importar Leads"
                            }
                            onConfirm={() => {
                                if (previewType === "export") {
                                    exportLeadsToExcel(filteredLeads);
                                } else {
                                    importLeads(importedLeads);
                                }

                                setPreviewType(null);
                            }}
                            onCancel={() => setPreviewType(null)}
                        />
                    )}

                </div>

            </div>

            <LeadsTable
                leads={paginatedLeads}
                updateLeadStatus={updateLeadStatus}
                onDelete={handleDelete}
            />

            <LeadsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() =>
                    updateParams({ page: String(currentPage - 1) })
                }
                onNext={() =>
                    updateParams({ page: String(currentPage + 1) })
                }
            />
        </div>
    );
}