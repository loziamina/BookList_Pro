/**
 * Mutations CRUD ouvrages.
 * Après succès : met à jour le détail en cache + invalide toutes les listes.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Book, BookFormData, BookUpdate } from "@/domain/book";
import { booksKeys } from "@/lib/query-keys";
import {
  createBook,
  deleteBook,
  replaceBook,
  updateBook,
} from "@/services/api/books-api";

export type ReplaceBookVariables = {
  id: string;
  input: BookFormData;
  version?: number;
};

export type UpdateBookVariables = {
  id: string;
  input: BookUpdate;
  version?: number;
};

function useRefreshBookCache() {
  const queryClient = useQueryClient();

  return async (book: Book) => {
    queryClient.setQueryData(booksKeys.detail(book.id), book);
    await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
  };
}

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBook,
    onSuccess: async (book) => {
      queryClient.setQueryData(booksKeys.detail(book.id), book);
      await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

/** Remplacement complet (formulaire d’édition → PUT). */
export function useUpdateBook() {
  const refreshBookCache = useRefreshBookCache();

  return useMutation({
    mutationFn: ({ id, input, version }: ReplaceBookVariables) =>
      replaceBook(id, input, version),
    onSuccess: refreshBookCache,
  });
}

/** Patch partiel (champs isolés → PATCH). */
export function usePatchBook() {
  const refreshBookCache = useRefreshBookCache();

  return useMutation({
    mutationFn: ({ id, input, version }: UpdateBookVariables) =>
      updateBook(id, input, version),
    onSuccess: refreshBookCache,
  });
}

/** Réexport : toggle lu (implémentation optimiste dans use-book-actions). */
export { useToggleReadStatus } from "@/hooks/queries/use-book-actions";

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBook,
    onSuccess: async (_, id) => {
      queryClient.removeQueries({ queryKey: booksKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}
