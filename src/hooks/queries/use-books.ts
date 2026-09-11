/**
 * Hook liste paginée.
 * - queryKey = filtres normalisés → nouvelle recherche = nouvelle entrée cache
 * - signal Query → annule la requête précédente côté client HTTP
 * - keepPreviousData → distinguer chargement initial vs page suivante / filtres
 */
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

  // Premier affichage : pas encore de données (ni placeholder).
  const isInitialLoading = query.isPending && !query.isPlaceholderData;
  // Refetch sur la même clé (ex. invalidate) sans placeholder.
  const isRefreshing =
    query.isFetching && !query.isPending && !query.isPlaceholderData;
  // Changement de page/filtres : on affiche encore l’ancienne page.
  const isFetchingNextPage =
    query.isFetching && query.isPlaceholderData;

  return {
    ...query,
    isInitialLoading,
    isRefreshing,
    isFetchingNextPage,
  };
}
