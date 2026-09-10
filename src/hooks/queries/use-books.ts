import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { BookFilters, bookFiltersSchema } from "@/domain/book-filters";
import { booksKeys } from "@/lib/query-keys";
import { getBooks } from "@/services/api/books-api";

export function useBooks(filters: BookFilters = {}) {
  const normalizedFilters = bookFiltersSchema.parse(filters);

  return useQuery({
    queryKey: booksKeys.list(normalizedFilters),
    queryFn: ({ signal }) => getBooks(normalizedFilters, signal),
    placeholderData: keepPreviousData,
  });
}
