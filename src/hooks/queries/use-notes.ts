/**
 * Hook liste des notes d’un livre.
 */
import { useQuery } from "@tanstack/react-query";

import { booksKeys } from "@/lib/query-keys";
import { getNotes } from "@/services/api/notes-api";

export function useNotes(bookId: string) {
  return useQuery({
    queryKey: booksKeys.notes(bookId),
    queryFn: ({ signal }) => getNotes(bookId, signal),
    enabled: bookId.length > 0,
  });
}
