/**
 * Filtres, tri et pagination de la liste.
 * Normalisés ici pour que la queryKey TanStack Query soit stable et prévisible.
 */
import { z } from "zod";

export const bookFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
  // Défaut 20 : évite d’afficher les 500 ouvrages seedés d’un coup.
  limit: z.number().int().min(1).max(100).default(20),
  q: z.string().trim().optional(),
  auteur: z.string().trim().optional(),
  status: z.enum(["lu", "nonlu"]).optional(),
  favori: z.boolean().optional(),
  sort: z
    .enum(["titre", "auteur", "annee", "note", "updatedAt"])
    .default("titre"),
  order: z.enum(["asc", "desc"]).default("asc"),
});

/** Entrée flexible (valeurs optionnelles avant parse). */
export type BookFilters = z.input<typeof bookFiltersSchema>;
/** Sortie après parse : page/limit/sort/order toujours présents. */
export type NormalizedBookFilters = z.output<typeof bookFiltersSchema>;
