import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Note, NoteFormData } from "@/domain/note";
import { booksKeys } from "@/lib/query-keys";
import { createNote, deleteNote } from "@/services/api/notes-api";

export function useCreateNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NoteFormData) => createNote(bookId, input),
    onSuccess: async (note) => {
      queryClient.setQueryData<Note[]>(booksKeys.notes(bookId), (current) =>
        current ? [note, ...current] : [note],
      );
      await queryClient.invalidateQueries({ queryKey: booksKeys.notes(bookId) });
    },
  });
}

export function useDeleteNote(bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => deleteNote(bookId, noteId),
    onSuccess: async (_, noteId) => {
      queryClient.setQueryData<Note[]>(booksKeys.notes(bookId), (current) =>
        current ? current.filter((note) => note.id !== noteId) : current,
      );
      await queryClient.invalidateQueries({ queryKey: booksKeys.notes(bookId) });
    },
  });
}
