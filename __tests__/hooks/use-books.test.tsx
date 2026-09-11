import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react-native";
import { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Book } from "@/domain/book";
import { PaginatedResponse } from "@/domain/pagination";
import { useBooks } from "@/hooks/queries/use-books";
import { getBooks } from "@/services/api/books-api";

jest.mock("@/services/api/books-api", () => ({
  getBooks: jest.fn(),
}));

const response: PaginatedResponse<Book> = {
  items: [],
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

const mockedGetBooks = jest.mocked(getBooks);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
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

describe("useBooks", () => {
  beforeEach(() => {
    mockedGetBooks.mockReset();
  });

  it("loads a server page with normalized filters", async () => {
    mockedGetBooks.mockResolvedValue(response);
    const { Wrapper, queryClient } = createWrapper();

    const { result, unmount } = await renderHook(
      () => useBooks({ q: "dune", status: "lu" }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(response);
    expect(mockedGetBooks).toHaveBeenCalledWith(
      {
        page: 1,
        limit: 20,
        q: "dune",
        status: "lu",
        sort: "titre",
        order: "asc",
      },
      expect.any(AbortSignal),
    );
    expect(result.current.isInitialLoading).toBe(false);
    expect(result.current.isFetchingNextPage).toBe(false);

    await unmount();
    queryClient.clear();
  });
});
