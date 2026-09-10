import { useQuery } from "@tanstack/react-query";

import { booksKeys } from "@/lib/query-keys";
import { getBook } from "@/services/api/books-api";

export function useBook(id: string) {
  return useQuery({
    queryKey: booksKeys.detail(id),
    queryFn: ({ signal }) => getBook(id, signal),
    enabled: id.length > 0,
  });
}
