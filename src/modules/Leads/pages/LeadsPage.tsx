import { useSearchParams } from "react-router-dom";

import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";

import LeadsFilter from "../components/LeadsFilter";
import LeadsPagination from "../components/LeadsPagination";
import LeadsTable from "../components/LeadsTable";

import { useLeadsFilter } from "../hooks/useLeadsFilter";
import { useLeadsPagination } from "../hooks/useLeadsPagination";
import { exportLeadsToExcel } from "../utils/exportLeadsToExcel";

const ITEMS_PER_PAGE = 5;

export default function Leads() {
    const { leads, updateLeadStatus } = useLeads();
    const [searchParams, setSearchParams] = useSearchParams();

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

    const filteredLeads = useLeadsFilter({
        leads,
        status: statusParam,
        search: searchParam,
    });

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

                    <button
                        onClick={() => exportLeadsToExcel(filteredLeads)}
                        className="bg-green-600 text-white px-4 py-2 rounded w-fit"
                    >
                        Exportar Excel
                    </button>

                </div>

            </div>

            <LeadsTable
                leads={paginatedLeads}
                updateLeadStatus={updateLeadStatus}
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