/**
 * Domaine Book.
 * Zod sert de contrat unique : validation API + types TypeScript dérivés.
 * L’UI et les services ne redéfinissent pas la forme du livre ailleurs.
 */
import { z } from "zod";

const nextYear = new Date().getFullYear() + 1;

/** Réponse serveur complète d’un ouvrage (GET /books, GET /books/:id). */
export const bookSchema = z.object({
  id: z.string().uuid(),
  titre: z.string().min(1),
  auteur: z.string().min(1),
  editeur: z.string(),
  annee: z.number().int().min(1450).max(nextYear),
  lu: z.boolean(),
  favori: z.boolean(),
  note: z.number().min(0).max(5).nullable(),
  couverture: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  // Utilisé avec If-Match pour détecter les conflits de mise à jour (409).
  version: z.number().int().nonnegative(),
});

/** Payload de création / remplacement (POST, PUT) — sans champs serveur. */
export const bookFormSchema = z.object({
  titre: z.string().trim().min(1, "Le titre est obligatoire."),
  auteur: z.string().trim().min(1, "L'auteur est obligatoire."),
  editeur: z.string().trim().min(1, "L'éditeur est obligatoire."),
  annee: z
    .number({ error: "L'année doit être un nombre." })
    .int("L'année doit être un entier.")
    .min(1450, "L'année doit être supérieure ou égale à 1450.")
    .max(nextYear, `L'année ne peut pas dépasser ${nextYear}.`),
  lu: z.boolean(),
});

/**
 * Mise à jour partielle (PATCH) : favori, note, ou un sous-ensemble du formulaire.
 * Utilisé notamment par les toggles optimistes (favori / lu).
 */
export const bookUpdateSchema = bookFormSchema.partial().extend({
  favori: z.boolean().optional(),
  note: z.number().min(0).max(5).nullable().optional(),
  couverture: z.string().nullable().optional(),
});

export type Book = z.infer<typeof bookSchema>;
export type BookFormData = z.infer<typeof bookFormSchema>;
export type BookUpdate = z.infer<typeof bookUpdateSchema>;
