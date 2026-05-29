import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";

import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";
import LeadsPreviewModal from "../components/LeadsPreviewModal";
import { useEffect, useState } from "react";
import { parseExcel } from "../utils/importLeadsFromExcel";
import type { Lead } from "@/types/LeadType";

export default function Leads() {
    const {
        leads,
        loading,
        fetchLeads,
        fetchByStatus,
        patchLeadStatus,
        deleteLead,
        importLeads,
        totalPages, } = useLeads();
    const [previewType, setPreviewType] = useState<"export" | "import" | null>(null);
    const [importedLeads, setImportedLeads] = useState<Lead[]>([]);
    const [status, setStatus] = useState<LeadStatus | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState<number>(0);

    useEffect(() => {
        async function load() {
            if (status) {
                await fetchByStatus(
                    status,
                    page
                );
            } else {
                await fetchLeads(
                    page
                )
            }
        }

        load();
    }, [status, page]);

    function handleStatusChanges(newStatus: LeadStatus | null) {
        setStatus(newStatus);
        setPage(0);
    }

    function handleSearchChanges(value: string | "") {
        setSearch(value);
        setPage(0);
    }

    async function handleFileImport(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const parsedLeads = await parseExcel(file);

        setImportedLeads(parsedLeads);
        setPreviewType("import");
    }

    const filteredLeads = leads;

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
                        status={status ? status : ""}
                        search={search}
                        onStatusChange={(value) => handleStatusChanges(value)}
                        onSearchChange={(value) =>  handleSearchChanges(value) }
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
                currentPage={page + 1}
                totalPages={totalPages}
                onPrev={() =>
                    setPage((p) => Math.max(0, p - 1))}

                onNext={() =>
                    setPage((p) => p + 1)
                }
            />
        </div>
    );
}