import { useRouter } from "expo-router";

import { useDeleteBook } from "@/hooks/queries/use-book-mutations";

export function useBookDeletion(bookId: string) {
  const router = useRouter();
  const deleteBook = useDeleteBook();

  function performDelete() {
    deleteBook.mutate(bookId, {
      onSuccess: () => {
        router.back();
      },
    });
  }

  return {
    performDelete,
    isDeleting: deleteBook.isPending,
  };
}