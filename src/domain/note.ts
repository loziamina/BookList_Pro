/**
 * Domaine Note.
 * Notes de lecture rattachées à un livre (`livreId`).
 */
import { z } from "zod";

export const noteSchema = z.object({
  id: z.string().uuid(),
  livreId: z.string().uuid(),
  contenu: z.string().min(1).max(1000),
  createdAt: z.iso.datetime(),
});

/** Payload d’ajout : seul le contenu est saisi côté formulaire. */
export const noteFormSchema = z.object({
  contenu: z
    .string()
    .trim()
    .min(1, "La note de lecture ne peut pas être vide.")
    .max(1000, "La note de lecture ne peut pas dépasser 1000 caractères."),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = z.infer<typeof noteFormSchema>;
