import { useSearchParams } from "react-router-dom";

import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";

import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { useLeadsFilter } from "../hooks/useLeadsFilter";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import LeadsPreviewModal from "../components/LeadsPreviewModal";
import { useEffect, useState } from "react";
import { parseExcel } from "../utils/importLeadsFromExcel";
import type { Lead } from "@/types/LeadType";
import { patchStatus } from "@/services/leads/leadsService";


export default function Leads() {
    const {
        leads,
        loading,
        fetchLeads,
        patchLeadStatus,
        deleteLead,
        importLeads,
        setPage,
        totalPages, } = useLeads();
    const [searchParams, setSearchParams] = useSearchParams();
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

    useEffect(() => {
        async function load() {
            setPage(currentPage - 1);
            await fetchLeads();
        }

        load();
    }, [currentPage]);

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

    async function handleDelete(id: string) {

        await deleteLead(id);
    }

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">
                    Carregando leads...
                </p>
            </div>
        );
    }
    
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
                leads={filteredLeads}
                patchLeadStatus={patchLeadStatus}
                onDelete={handleDelete}
            />

            <LeadsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={() =>
                    updateParams({
                        page: String(Math.max(currentPage - 1, 1))
                    })
                }
                onNext={() =>
                    updateParams({
                        page: String(currentPage + 1)
                    })
                }
            />
        </div>
    );
}