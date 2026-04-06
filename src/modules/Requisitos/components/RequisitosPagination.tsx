// components/RequisitosPagination.tsx
interface Props {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function RequisitosPagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={onPrev}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Anterior
      </button>

      <span className="px-3 py-1 text-sm">
        Página {currentPage} de {totalPages}
      </span>

      <button
        disabled={currentPage === totalPages}
        onClick={onNext}
        className="px-3 py-1 border rounded disabled:opacity-40"
      >
        Próxima
      </button>
    </div>
  );
}