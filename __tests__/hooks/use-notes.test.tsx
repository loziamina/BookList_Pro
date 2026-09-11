import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Note } from "@/domain/note";
import {
  useCreateNote,
  useDeleteNote,
} from "@/hooks/queries/use-note-mutations";
import { useNotes } from "@/hooks/queries/use-notes";
import { booksKeys } from "@/lib/query-keys";
import {
  createNote,
  deleteNote,
  getNotes,
} from "@/services/api/notes-api";

jest.mock("@/services/api/notes-api", () => ({
  createNote: jest.fn(),
  deleteNote: jest.fn(),
  getNotes: jest.fn(),
}));

const bookId = "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386";

const note: Note = {
  id: "3f3c3a0d-4ef8-4ef6-9a8d-347de62dd387",
  livreId: bookId,
  contenu: "Une note de lecture.",
  createdAt: "2026-09-11T10:00:00.000Z",
};

const mockedGetNotes = jest.mocked(getNotes);
const mockedCreateNote = jest.mocked(createNote);
const mockedDeleteNote = jest.mocked(deleteNote);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return { Wrapper, queryClient };
}

describe("notes hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("charge les notes d'un ouvrage avec AbortSignal", async () => {
    mockedGetNotes.mockResolvedValue([note]);
    const { Wrapper, queryClient } = createWrapper();

    const { result, unmount } = await renderHook(() => useNotes(bookId), {
      wrapper: Wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([note]);
    expect(mockedGetNotes).toHaveBeenCalledWith(
      bookId,
      expect.any(AbortSignal),
    );

    await unmount();
    queryClient.clear();
  });

  it("ajoute une note au cache après création", async () => {
    mockedCreateNote.mockResolvedValue(note);
    const { Wrapper, queryClient } = createWrapper();
    const { result, unmount } = await renderHook(
      () => useCreateNote(bookId),
      { wrapper: Wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync({ contenu: note.contenu });
    });

    expect(queryClient.getQueryData(booksKeys.notes(bookId))).toEqual([note]);

    await unmount();
    queryClient.clear();
  });

  it("retire une note du cache après suppression", async () => {
    mockedDeleteNote.mockResolvedValue();
    const { Wrapper, queryClient } = createWrapper();
    queryClient.setQueryData(booksKeys.notes(bookId), [note]);
    const { result, unmount } = await renderHook(
      () => useDeleteNote(bookId),
      { wrapper: Wrapper },
    );

    await act(async () => {
      await result.current.mutateAsync(note.id);
    });

    expect(queryClient.getQueryData(booksKeys.notes(bookId))).toEqual([]);

    await unmount();
    queryClient.clear();
  });
});
