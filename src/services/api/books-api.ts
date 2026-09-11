/**
 * Service REST des ouvrages.
 * Couche fine au-dessus de `apiRequest` : chemins, query string, If-Match.
 * Pas de logique UI ici — uniquement HTTP + Zod.
 */
import { BookFilters, bookFiltersSchema } from "@/domain/book-filters";
import {
  Book,
  BookFormData,
  BookUpdate,
  bookSchema,
} from "@/domain/book";
import {
  PaginatedResponse,
  paginatedResponseSchema,
} from "@/domain/pagination";

import { apiRequest } from "./client";

const paginatedBooksSchema = paginatedResponseSchema(bookSchema);

/** Header de concurrence optimiste exigé par l’API sur PUT/PATCH. */
function versionHeaders(version?: number): Record<string, string> | undefined {
  return version === undefined ? undefined : { "If-Match": String(version) };
}

/** Construit la query string à partir des filtres normalisés (Zod). */
function buildBooksQuery(filters: BookFilters): string {
  const normalized = bookFiltersSchema.parse(filters);
  const params = new URLSearchParams({
    page: String(normalized.page),
    limit: String(normalized.limit),
    sort: normalized.sort,
    order: normalized.order,
  });

  if (normalized.q) params.set("q", normalized.q);
  if (normalized.auteur) params.set("auteur", normalized.auteur);
  if (normalized.status) params.set("status", normalized.status);
  if (normalized.favori !== undefined) {
    params.set("favori", String(normalized.favori));
  }

  return params.toString();
}

/** GET /books — liste paginée (défaut 20 items). */
export function getBooks(
  filters: BookFilters = {},
  signal?: AbortSignal,
): Promise<PaginatedResponse<Book>> {
  return apiRequest({
    path: `/books?${buildBooksQuery(filters)}`,
    schema: paginatedBooksSchema,
    signal,
  });
}

/** GET /books/:id */
export function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    schema: bookSchema,
    signal,
  });
}

/** POST /books */
export function createBook(input: BookFormData): Promise<Book> {
  return apiRequest({
    path: "/books",
    method: "POST",
    body: input,
    schema: bookSchema,
  });
}

/** PUT /books/:id — remplacement complet + If-Match. */
export function replaceBook(
  id: string,
  input: BookFormData,
  version?: number,
): Promise<Book> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    method: "PUT",
    body: input,
    headers: versionHeaders(version),
    schema: bookSchema,
  });
}

/** PATCH /books/:id — patch partiel (favori, lu, note…). */
export function updateBook(
  id: string,
  input: BookUpdate,
  version?: number,
): Promise<Book> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    method: "PATCH",
    body: input,
    headers: versionHeaders(version),
    schema: bookSchema,
  });
}

/** DELETE /books/:id */
export function deleteBook(id: string): Promise<void> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    method: "DELETE",
    schema: null,
  });
}
