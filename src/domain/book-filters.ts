import { z } from "zod";

export const bookFiltersSchema = z.object({
  page: z.number().int().positive().default(1),
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

export type BookFilters = z.input<typeof bookFiltersSchema>;
export type NormalizedBookFilters = z.output<typeof bookFiltersSchema>;
