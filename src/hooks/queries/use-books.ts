import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { BookFilters, bookFiltersSchema } from "@/domain/book-filters";
import { booksKeys } from "@/lib/query-keys";
import { getBooks } from "@/services/api/books-api";

export function useBooks(filters: BookFilters = {}) {
  const normalizedFilters = bookFiltersSchema.parse(filters);

  const query = useQuery({
    queryKey: booksKeys.list(normalizedFilters),
    queryFn: ({ signal }) => getBooks(normalizedFilters, signal),
    placeholderData: keepPreviousData,
  });

  const isInitialLoading = query.isPending && !query.isPlaceholderData;
  const isRefreshing =
    query.isFetching && !query.isPending && !query.isPlaceholderData;
  const isFetchingNextPage =
    query.isFetching && query.isPlaceholderData;

  return {
    ...query,
    isInitialLoading,
    isRefreshing,
    isFetchingNextPage,
  };
}
