import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLeads } from "@/app/providers/LeadProvider";
import { LeadStatus } from "@/shared/types/LeadType";
import Permission from "@/shared/permissions/Permission";
import { UserRoles } from "@/shared/types/UserTypes";

const ITEMS_PER_PAGE = 5;

export default function LeadsPage() {
    const { leads, updateLeadStatus } = useLeads();
    const [searchParams, setSearchParams] = useSearchParams();

    // 🔹 URL é a fonte de verdade
    const statusParam = searchParams.get("status") as LeadStatus | null;
    const searchParam = searchParams.get("search") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const [debouncedSearch, setDebouncedSearch] = useState(searchParam)

    // 🔹 Função utilitária para atualizar URL
    function updateParams(newParams: Record<string, string | null>) {
        const params = new URLSearchParams(searchParams);

        Object.entries(newParams).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        setSearchParams(params);
    }

    // 🔎 Filtro por status
    const statusFiltered = useMemo(() => {
        if (!statusParam) return leads;
        return leads.filter((lead) => lead.status === statusParam);
    }, [leads, statusParam]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchParam);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchParam]);

    // 🔎 Filtro por busca
    const searchFiltered = useMemo(() => {
        if (!debouncedSearch.trim()) return statusFiltered;

        const searchLower = debouncedSearch.toLowerCase();
        const searchNumbers = debouncedSearch.replace(/\D/g, "");


        return statusFiltered.filter((lead) => {
            const telefoneLimpo = lead.telefone.replace(/\D/g, "");

            return (
                lead.nome.toLowerCase().includes(searchLower) ||
                lead.email.toLowerCase().includes(searchLower) ||
                (searchNumbers && telefoneLimpo.includes(searchNumbers))
            );
        });
    }, [statusFiltered, debouncedSearch]);

    // 🔎 Paginação
    const totalPages = Math.ceil(searchFiltered.length / ITEMS_PER_PAGE);

    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return searchFiltered.slice(start, start + ITEMS_PER_PAGE);
    }, [searchFiltered, currentPage]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Leads</h1>
                    <div className="text-sm text-gray-500">
                        {searchFiltered.length} resultado(s)
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-4">
                    {/* Status */}
                    <select
                        value={statusParam || ""}
                        onChange={(e) =>
                            updateParams({
                                status: e.target.value || null,
                                page: null, // reset página
                            })
                        }
                        className="border rounded-md px-3 py-2"
                    >
                        <option value="">Todos os status</option>
                        {Object.values(LeadStatus).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>

                    {/* Busca */}
                    <input
                        type="text"
                        placeholder="Buscar por nome, email ou telefone..."
                        value={searchParam}
                        onChange={(e) =>
                            updateParams({
                                search: e.target.value || null,
                                page: null, // reset página
                            })
                        }
                        className="border rounded-md px-3 py-2 w-64"
                    />
                </div>
            </div>

            {/* Tabela */}
            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-left border-b">
                        <th className="py-3">Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {paginatedLeads.map((lead) => (
                        <tr key={lead.id} className="border-b hover:bg-gray-50">
                            <td className="py-3">{lead.nome}</td>
                            <td>{lead.email}</td>
                            <td>{lead.telefone}</td>
                            <td>
                                <select
                                    value={lead.status}
                                    onChange={(e) =>
                                        updateLeadStatus(
                                            lead.id,
                                            e.target.value as LeadStatus
                                        )
                                    }
                                    className="border rounded-md px-2 py-1"
                                >
                                    {Object.values(LeadStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="">
                                <Permission allowed={[UserRoles.GERENTE]}>
                                    <button className="bg-red-500 text-white font-bold rounded-2xl p-2 ">
                                        Excluir Lead
                                    </button>
                                </Permission>
                            </td>
                        </tr>
                    ))}

                    {paginatedLeads.length === 0 && (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-gray-400">
                                Nenhum lead encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="flex justify-end gap-2 mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() =>
                            updateParams({
                                page: String(currentPage - 1),
                            })
                        }
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Anterior
                    </button>

                    <span className="px-3 py-1 text-sm">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() =>
                            updateParams({
                                page: String(currentPage + 1),
                            })
                        }
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}