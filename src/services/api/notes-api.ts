/**
 * Service REST des notes de lecture.
 * Endpoints imbriqués : /books/:bookId/notes[/:noteId].
 */
import { Note, NoteFormData, noteSchema } from "@/domain/note";
import { z } from "zod";

import { apiRequest } from "./client";

const notesListSchema = z.array(noteSchema);

/** GET /books/:id/notes — `signal` pour annuler si on quitte la fiche. */
export function getNotes(
  bookId: string,
  signal?: AbortSignal,
): Promise<Note[]> {
  return apiRequest({
    path: `/books/${encodeURIComponent(bookId)}/notes`,
    schema: notesListSchema,
    signal,
  });
}

/** POST /books/:id/notes */
export function createNote(
  bookId: string,
  input: NoteFormData,
): Promise<Note> {
  return apiRequest({
    path: `/books/${encodeURIComponent(bookId)}/notes`,
    method: "POST",
    body: input,
    schema: noteSchema,
  });
}

/** DELETE /books/:id/notes/:noteId */
export function deleteNote(bookId: string, noteId: string): Promise<void> {
  return apiRequest({
    path: `/books/${encodeURIComponent(bookId)}/notes/${encodeURIComponent(noteId)}`,
    method: "DELETE",
    schema: null,
  });
}
