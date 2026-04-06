// hooks/usePagination.ts
import { useMemo } from "react";

interface Props<T> {
  data: T[];
  currentPage: number;
  itemsPerPage: number;
}

export function usePagination<T>({
  data,
  currentPage,
  itemsPerPage,
}: Props<T>) {
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  return {
    paginatedData,
    totalPages,
  };
}