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

export const openLibraryKeys = {
  all: ["open-library"] as const,
  search: (title: string) => [...openLibraryKeys.all, title] as const,
};
