/**
 * Contrat Open Library (recherche par titre).
 * On ne garde que ce dont la fiche a besoin : le nombre d’éditions.
 */
import { z } from "zod";

export const openLibraryDocSchema = z.object({
  title: z.string().optional(),
  edition_count: z.number().int().nonnegative().optional(),
});

export const openLibrarySearchSchema = z.object({
  numFound: z.number().int().nonnegative().optional(),
  num_found: z.number().int().nonnegative().optional(),
  docs: z.array(openLibraryDocSchema).default([]),
});

export type OpenLibrarySearch = z.infer<typeof openLibrarySearchSchema>;

export type OpenLibraryEditionsResult = {
  /** Nombre d’éditions (0 = résultat normal, pas une erreur). */
  editionCount: number;
  /** false si l’appel Open Library a échoué : la fiche doit rester utilisable. */
  available: boolean;
};
