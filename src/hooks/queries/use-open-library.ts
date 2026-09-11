/**
 * Nombre d’éditions Open Library pour un titre.
 * retry désactivé : un échec ne doit pas bloquer la fiche.
 */
import { useQuery } from "@tanstack/react-query";

import { openLibraryKeys } from "@/lib/query-keys";
import { getOpenLibraryEditionCount } from "@/services/open-library/open-library-api";

export function useOpenLibraryEditions(title: string) {
  const normalizedTitle = title.trim();

  return useQuery({
    queryKey: openLibraryKeys.search(normalizedTitle),
    queryFn: ({ signal }) =>
      getOpenLibraryEditionCount(normalizedTitle, signal),
    enabled: normalizedTitle.length > 0,
    retry: false,
    staleTime: 5 * 60_000,
  });
}
