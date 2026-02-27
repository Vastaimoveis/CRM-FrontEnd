import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";
import { LeadStatus } from "../../types/LeadType";

const ITEMS_PER_PAGE = 5;

export default function LeadsPage() {
    const { leads, updateLeadStatus } = useLeads();
    const [searchParams, setSearchParams] = useSearchParams();

    // 📌 Ler parâmetros da URL
    const statusParam = searchParams.get("status") as LeadStatus | null;
    const searchParam = searchParams.get("search") || "";
    const pageParam = Number(searchParams.get("page")) || 1;

    // 📌 Estados iniciando com valores da URL
    const [searchInput, setSearchInput] = useState(searchParam);
    const [debouncedSearch, setDebouncedSearch] = useState(searchParam);
    const [currentPage, setCurrentPage] = useState(pageParam);

    // 🔥 Debounce manual
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchInput]);

    // 🔥 Sincronizar URL automaticamente
    useEffect(() => {
        const params: Record<string, string> = {};

        if (statusParam) params.status = statusParam;
        if (debouncedSearch.trim()) params.search = debouncedSearch;
        if (currentPage > 1) params.page = String(currentPage);

        setSearchParams(params);
    }, [statusParam, debouncedSearch, currentPage, setSearchParams]);

    // 🔎 Filtro por status
    function handleStatusChange(value: string) {
        setCurrentPage(1);

        const params: Record<string, string> = {};

        if (value) params.status = value;
        if (debouncedSearch.trim()) params.search = debouncedSearch;

        setSearchParams(params);
    }

    // 🎯 1️⃣ Filtrar por status
    const statusFiltered = useMemo(() => {
        if (!statusParam) return leads;
        return leads.filter((lead) => lead.status === statusParam);
    }, [leads, statusParam]);

    // 🎯 2️⃣ Filtrar por busca (nome/email/telefone)
    const searchFiltered = useMemo(() => {
        if (!debouncedSearch.trim()) return statusFiltered;

        const searchLower = debouncedSearch.toLowerCase();
        const searchNumbers = debouncedSearch.replace(/\D/g, "");

        return statusFiltered.filter((lead) => {
            const telefoneLimpo = lead.telefone.replace(/\D/g, "");

            return (
                lead.nome.toLowerCase().includes(searchLower) ||
                lead.email.toLowerCase().includes(searchLower) ||
                telefoneLimpo.includes(searchNumbers)
            );
        });
    }, [statusFiltered, debouncedSearch]);

    // 🎯 3️⃣ Paginação
    const totalPages = Math.ceil(searchFiltered.length / ITEMS_PER_PAGE);

    // Corrigir página inválida se filtro reduzir resultados
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const paginatedLeads = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return searchFiltered.slice(start, start + ITEMS_PER_PAGE);
    }, [searchFiltered, currentPage]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex flex-col gap-4 mb-6">

                {/* Linha superior */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Leads
                    </h1>

                    <div className="text-sm text-gray-500">
                        {searchFiltered.length} resultado(s)
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-4">

                    {/* Status */}
                    <select
                        value={statusParam || ""}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
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
                        value={searchInput}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setSearchInput(e.target.value);
                        }}
                        className="border rounded-md px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-black"
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
                                    className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
                                >
                                    {Object.values(LeadStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
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
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Anterior
                    </button>

                    <span className="px-3 py-1 text-sm">
                        Página {currentPage} de {totalPages}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-40"
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}