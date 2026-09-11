import { useCallback, useState } from "react";

import { isAppError } from "@/domain/app-error";
import { NoteFormData } from "@/domain/note";
import { useCreateNote, useDeleteNote } from "@/hooks/queries/use-note-mutations";
import { useNotes } from "@/hooks/queries/use-notes";

function toErrorMessage(error: unknown): string {
  return isAppError(error) ? error.message : "Une erreur inattendue est survenue.";
}

export function useNotesPanel(bookId: string) {
  const { data: notes, isLoading, isError, refetch } = useNotes(bookId);
  const createNote = useCreateNote(bookId);
  const deleteNote = useDeleteNote(bookId);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [addNoteError, setAddNoteError] = useState<string | null>(null);
  const [deleteNoteError, setDeleteNoteError] = useState<string | null>(null);

  const addNote = useCallback(
    async (data: NoteFormData) => {
      setAddNoteError(null);

      try {
        await createNote.mutateAsync(data);
      } catch (error) {
        setAddNoteError(toErrorMessage(error));
        throw error;
      }
    },
    [createNote],
  );

  const removeNote = useCallback(
    (noteId: string) => {
      setDeleteNoteError(null);
      setDeletingNoteId(noteId);
      deleteNote.mutate(noteId, {
        onError: (error) => {
          setDeleteNoteError(toErrorMessage(error));
        },
        onSettled: () => setDeletingNoteId(null),
      });
    },
    [deleteNote],
  );

  return {
    notes: notes ?? [],
    isLoading,
    isError,
    refetch,
    addNote,
    addNoteError,
    isAddingNote: createNote.isPending,
    removeNote,
    deleteNoteError,
    deletingNoteId,
  };
}