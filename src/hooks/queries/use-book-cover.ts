/**
 * Mutations couverture d’un ouvrage.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Book } from "@/domain/book";
import { booksKeys } from "@/lib/query-keys";
import {
  deleteBookCover,
  uploadBookCover,
} from "@/services/api/covers-api";

type CoverVariables = {
  id: string;
  version?: number;
};

type UploadCoverVariables = CoverVariables & {
  imageData: string;
};

async function refreshAfterCoverChange(
  queryClient: ReturnType<typeof useQueryClient>,
  book: Book,
) {
  queryClient.setQueryData(booksKeys.detail(book.id), book);
  await queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
}

export function useUploadBookCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, imageData, version }: UploadCoverVariables) =>
      uploadBookCover(id, imageData, version),
    onSuccess: (book) => refreshAfterCoverChange(queryClient, book),
  });
}

export function useDeleteBookCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, version }: CoverVariables) =>
      deleteBookCover(id, version),
    onSuccess: (book) => refreshAfterCoverChange(queryClient, book),
  });
}
