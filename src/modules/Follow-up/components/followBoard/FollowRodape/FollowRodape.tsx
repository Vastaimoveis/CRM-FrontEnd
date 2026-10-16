interface Props {
    page: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    loading: boolean;
    onPageChange: (page: number) => void;
}

export default function FollowRodape({
    page,
    pageSize,
    totalElements,
    onPageChange,
    loading,
    totalPages,
}: Props) {

    const isFirstPage = page <= 0;
    const isLastPage = totalPages === 0 || page >= totalPages - 1;

    const startItem =
        totalElements === 0
            ? 0
            : page * pageSize + 1;

    const endItem = Math.min(
        (page + 1) * pageSize,
        totalElements
    );

    function handlePrevious() {
        if (isFirstPage) return;

        onPageChange(page - 1);
    }

    function handleNext() {
        if (isLastPage) return;

        onPageChange(page + 1);
    }

    return (
        <div className="
            flex flex-col gap-3 p-4
            text-sm text-slate-500
            sm:flex-row sm:items-center
            sm:justify-between
        ">

            {/* QUANTIDADE DE REGISTROS */}

            <span>
                Exibindo {startItem}–{endItem} de {totalElements} follow-ups
            </span>

            {/* PAGINAÇÃO */}

            <div className="flex items-center gap-3">

                <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={loading || isFirstPage}
                    className="
                        rounded-lg border border-slate-200
                        px-3 py-2 transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    Anterior
                </button>

                <span className="whitespace-nowrap text-slate-700">
                    Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
                </span>

                <button
                    type="button"
                    onClick={handleNext}
                    disabled={loading || isLastPage}
                    className="
                        rounded-lg border border-slate-200
                        px-3 py-2 transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}