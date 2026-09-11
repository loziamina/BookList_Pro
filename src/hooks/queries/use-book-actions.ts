/**
 * Mutations optimistes favori / lu.
 * Flux : onMutate (UI immédiate) → API → onError (rollback) → onSettled (resync).
 * Patche à la fois le détail et toutes les listes en cache.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Book } from "@/domain/book";
import { PaginatedResponse } from "@/domain/pagination";
import { booksKeys } from "@/lib/query-keys";
import { updateBook } from "@/services/api/books-api";

/** Snapshot pour restaurer le cache si le PATCH échoue. */
type OptimisticContext = {
  previousDetail?: Book;
  previousLists: [readonly unknown[], PaginatedResponse<Book> | undefined][];
};

/** Applique le patch localement et renvoie l’état précédent. */
function patchBookCache(
  queryClient: ReturnType<typeof useQueryClient>,
  bookId: string,
  patch: Partial<Pick<Book, "lu" | "favori">>,
): OptimisticContext {
  const previousDetail = queryClient.getQueryData<Book>(booksKeys.detail(bookId));
  const previousLists = queryClient.getQueriesData<PaginatedResponse<Book>>({
    queryKey: booksKeys.lists(),
  });

  if (previousDetail) {
    queryClient.setQueryData<Book>(booksKeys.detail(bookId), {
      ...previousDetail,
      ...patch,
    });
  }

  for (const [queryKey, page] of previousLists) {
    if (!page) {
      continue;
    }

    queryClient.setQueryData(queryKey, {
      ...page,
      items: page.items.map((book) =>
        book.id === bookId ? { ...book, ...patch } : book,
      ),
    });
  }

  return { previousDetail, previousLists };
}

/** Restaure le snapshot sauvegardé dans onMutate. */
function restoreBookCache(
  queryClient: ReturnType<typeof useQueryClient>,
  bookId: string,
  context?: OptimisticContext,
) {
  if (!context) {
    return;
  }

  if (context.previousDetail !== undefined) {
    queryClient.setQueryData(booksKeys.detail(bookId), context.previousDetail);
  } else {
    queryClient.removeQueries({ queryKey: booksKeys.detail(bookId) });
  }

  for (const [queryKey, page] of context.previousLists) {
    queryClient.setQueryData(queryKey, page);
  }
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      favori,
      version,
    }: {
      id: string;
      favori: boolean;
      version?: number;
    }) => updateBook(id, { favori }, version),
    onMutate: async ({ id, favori }) => {
      // Évite qu’un refetch concurrent écrase l’optimistic update.
      await queryClient.cancelQueries({ queryKey: booksKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: booksKeys.lists() });
      return patchBookCache(queryClient, id, { favori });
    },
    onError: (_error, { id }, context) => {
      restoreBookCache(queryClient, id, context);
    },
    onSuccess: (book) => {
      queryClient.setQueryData(booksKeys.detail(book.id), book);
    },
    onSettled: async (_data, _error, { id }) => {
      await queryClient.invalidateQueries({ queryKey: booksKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

export function useToggleReadStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      lu,
      version,
    }: {
      id: string;
      lu: boolean;
      version?: number;
    }) => updateBook(id, { lu }, version),
    onMutate: async ({ id, lu }) => {
      await queryClient.cancelQueries({ queryKey: booksKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: booksKeys.lists() });
      return patchBookCache(queryClient, id, { lu });
    },
    onError: (_error, { id }, context) => {
      restoreBookCache(queryClient, id, context);
    },
    onSuccess: (book) => {
      queryClient.setQueryData(booksKeys.detail(book.id), book);
    },
    onSettled: async (_data, _error, { id }) => {
      await queryClient.invalidateQueries({ queryKey: booksKeys.detail(id) });
      await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}
