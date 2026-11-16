import type { PageResponse } from "@/shared/types/api";
import type { Script } from "@/services/script/ScriptTypes";

interface ScriptPaginationProps {
    pagination: PageResponse<Script>;
    page: number;
    onPageChange: (page: number) => void;
}

export default function ScriptPagination({
    pagination,
    page,
    onPageChange,
}: ScriptPaginationProps) {
    if (pagination.totalPages <= 1) return null;

    return (
        <div className="
            flex flex-col sm:flex-row
            items-center justify-between
            gap-3 pt-2
        ">
            <span className="text-sm text-gray-500">
                Exibindo {pagination.numberOfElements} de{" "}
                {pagination.totalElements} scripts
            </span>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={pagination.first}
                    onClick={() => onPageChange(page - 1)}
                    className="
                        px-4 py-2 rounded-lg border border-gray-200
                        text-sm text-gray-600 hover:bg-gray-50
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition
                    "
                >
                    Anterior
                </button>

                <span className="text-sm text-gray-600 px-2">
                    {page + 1} / {pagination.totalPages}
                </span>

                <button
                    type="button"
                    disabled={pagination.last}
                    onClick={() => onPageChange(page + 1)}
                    className="
                        px-4 py-2 rounded-lg border border-gray-200
                        text-sm text-gray-600 hover:bg-gray-50
                        disabled:opacity-40 disabled:cursor-not-allowed
                        transition
                    "
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}