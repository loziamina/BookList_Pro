// TEMPORAIRE — à remplacer par src/hooks/use-books.ts dès qu'il est livré.
// Même signature attendue : useBooks(filters) -> résultat TanStack Query standard.
import { useQuery } from "@tanstack/react-query";

import type { BookFilters } from "@/domain/book-filters";
import { booksKeys } from "@/lib/query-keys";

import { fetchBooks } from "./api.temp";

export function useBooks(filters: BookFilters) {
  return useQuery({
    queryKey: booksKeys.list(filters),
    queryFn: ({ signal }) => fetchBooks(filters, signal),
  });
}
