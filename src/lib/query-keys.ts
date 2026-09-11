/**
 * Clés de cache TanStack Query.
 * Hiérarchie : all → lists/list(filters) | details/detail(id) → notes(id).
 * Invalider `lists()` rafraîchit toutes les pages/filtres ; `detail(id)` la fiche.
 */
import { BookFilters } from "@/domain/book-filters";

export const booksKeys = {
  all: ["books"] as const,
  lists: () => [...booksKeys.all, "list"] as const,
  list: (filters: BookFilters) =>
    [...booksKeys.lists(), filters] as const,
  details: () => [...booksKeys.all, "detail"] as const,
  detail: (id: string) => [...booksKeys.details(), id] as const,
  notes: (id: string) => [...booksKeys.detail(id), "notes"] as const,
};

/** Clés OpenLibrary (enrichissement fiche) — l’échec ne doit pas casser l’écran. */
export const openLibraryKeys = {
  all: ["open-library"] as const,
  search: (title: string) => [...openLibraryKeys.all, title] as const,
};
