import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Book } from "@/domain/book";
import { PaginatedResponse } from "@/domain/pagination";
import {
  useToggleFavorite,
  useToggleReadStatus,
} from "@/hooks/queries/use-book-actions";
import { booksKeys } from "@/lib/query-keys";
import { updateBook } from "@/services/api/books-api";

jest.mock("@/services/api/books-api", () => ({
  updateBook: jest.fn(),
}));

const book: Book = {
  id: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  titre: "Dune",
  auteur: "Frank Herbert",
  editeur: "Robert Laffont",
  annee: 1965,
  lu: false,
  favori: false,
  note: null,
  couverture: null,
  createdAt: "2026-09-09T10:00:00.000Z",
  updatedAt: "2026-09-09T10:00:00.000Z",
  version: 1,
};

const page: PaginatedResponse<Book> = {
  items: [book],
  page: 1,
  limit: 20,
  total: 1,
  totalPages: 1,
};

const mockedUpdateBook = jest.mocked(updateBook);

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

describe("optimistic book actions", () => {
  beforeEach(() => {
    mockedUpdateBook.mockReset();
  });

  it("met à jour le favori immédiatement puis conserve le résultat serveur", async () => {
    const updated = { ...book, favori: true, version: 2 };
    mockedUpdateBook.mockResolvedValue(updated);
    const { Wrapper, queryClient } = createWrapper();
    const listKey = booksKeys.list({ page: 1, limit: 20 });

    queryClient.setQueryData(booksKeys.detail(book.id), book);
    queryClient.setQueryData(listKey, page);

    const { result, unmount } = await renderHook(() => useToggleFavorite(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      result.current.mutate({
        id: book.id,
        favori: true,
        version: book.version,
      });
    });

    await waitFor(() =>
      expect(queryClient.getQueryData<Book>(booksKeys.detail(book.id))?.favori).toBe(
        true,
      ),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(queryClient.getQueryData(booksKeys.detail(book.id))).toEqual(updated);

    await unmount();
    queryClient.clear();
  });

  it("restaure le statut lu en cas d'échec serveur", async () => {
    mockedUpdateBook.mockRejectedValue({
      type: "network",
      message: "Service indisponible",
      retryable: true,
      status: 503,
    });

    const { Wrapper, queryClient } = createWrapper();
    const listKey = booksKeys.list({ page: 1, limit: 20 });

    queryClient.setQueryData(booksKeys.detail(book.id), book);
    queryClient.setQueryData(listKey, page);

    const { result, unmount } = await renderHook(() => useToggleReadStatus(), {
      wrapper: Wrapper,
    });

    await act(async () => {
      result.current.mutate({
        id: book.id,
        lu: true,
        version: book.version,
      });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.getQueryData(booksKeys.detail(book.id))).toEqual(book);
    expect(
      queryClient.getQueryData<PaginatedResponse<Book>>(listKey)?.items[0].lu,
    ).toBe(false);

    await unmount();
    queryClient.clear();
  });
});
