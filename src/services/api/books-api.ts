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

function versionHeaders(version?: number): Record<string, string> | undefined {
  return version === undefined ? undefined : { "If-Match": String(version) };
}

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

export function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    schema: bookSchema,
    signal,
  });
}

export function createBook(input: BookFormData): Promise<Book> {
  return apiRequest({
    path: "/books",
    method: "POST",
    body: input,
    schema: bookSchema,
  });
}

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

export function deleteBook(id: string): Promise<void> {
  return apiRequest({
    path: `/books/${encodeURIComponent(id)}`,
    method: "DELETE",
    schema: null,
  });
}
