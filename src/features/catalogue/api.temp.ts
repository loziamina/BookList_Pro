// TEMPORAIRE — à supprimer dès que services/api/books.ts est livré par l'équipe API.
// Reproduit l'interface attendue, pour ne pas bloquer le catalogue.
import { bookSchema, type Book } from "@/domain/book";
import type { BookFilters } from "@/domain/book-filters";
import {
  paginatedResponseSchema,
  type PaginatedResponse,
} from "@/domain/pagination";
import { apiRequest } from "@/services/api/client";

const booksListSchema = paginatedResponseSchema(bookSchema);

function toQueryString(filters: BookFilters): string {
  const params = new URLSearchParams();

  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  if (filters.q) params.set("q", filters.q);
  if (filters.status) params.set("status", filters.status);
  if (filters.favori !== undefined)
    params.set("favori", String(filters.favori));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);

  return params.toString();
}

export async function fetchBooks(
  filters: BookFilters,
  signal?: AbortSignal,
): Promise<PaginatedResponse<Book>> {
  const query = toQueryString(filters);

  return apiRequest({
    path: `/books${query ? `?${query}` : ""}`,
    schema: booksListSchema,
    signal,
  });
}
