import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Book } from "@/domain/book";
import { PaginatedResponse } from "@/domain/pagination";
import {
  createBook,
  deleteBook,
  getBook,
  getBooks,
  replaceBook,
  updateBook,
} from "@/services/api/books-api";
import { apiRequest } from "@/services/api/client";

jest.mock("@/services/api/client", () => ({
  apiRequest: jest.fn(),
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
  couverture: "/covers/dune.svg",
  createdAt: "2026-09-09T10:00:00.000Z",
  updatedAt: "2026-09-09T10:00:00.000Z",
  version: 1,
};

const page: PaginatedResponse<Book> = {
  items: [book],
  page: 2,
  limit: 20,
  total: 25,
  totalPages: 2,
};

const mockedApiRequest = jest.mocked(apiRequest);

describe("books API service", () => {
  beforeEach(() => {
    mockedApiRequest.mockReset();
  });

  it("serializes server-side filters and pagination", async () => {
    mockedApiRequest.mockResolvedValue(page);

    await expect(
      getBooks({
        page: 2,
        q: "dune",
        status: "nonlu",
        favori: false,
        sort: "annee",
        order: "desc",
      }),
    ).resolves.toEqual(page);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        path:
          "/books?page=2&limit=20&sort=annee&order=desc&q=dune&status=nonlu&favori=false",
      }),
    );
  });

  it("encodes a book identifier in the detail path", async () => {
    mockedApiRequest.mockResolvedValue(book);

    await getBook("id with spaces");

    expect(mockedApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/books/id%20with%20spaces" }),
    );
  });

  it("uses the expected methods for create, replace and patch", async () => {
    mockedApiRequest.mockResolvedValue(book);
    const input = {
      titre: book.titre,
      auteur: book.auteur,
      editeur: book.editeur,
      annee: book.annee,
      lu: book.lu,
    };

    await createBook(input);
    await replaceBook(book.id, input, 1);
    await updateBook(book.id, { lu: true }, 1);

    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ path: "/books", method: "POST", body: input }),
    );
    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        method: "PUT",
        headers: { "If-Match": "1" },
      }),
    );
    expect(mockedApiRequest).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        method: "PATCH",
        body: { lu: true },
        headers: { "If-Match": "1" },
      }),
    );
  });

  it("requests a no-content response when deleting", async () => {
    mockedApiRequest.mockResolvedValue(undefined);

    await deleteBook(book.id);

    expect(mockedApiRequest).toHaveBeenCalledWith({
      path: `/books/${book.id}`,
      method: "DELETE",
      schema: null,
    });
  });
});
