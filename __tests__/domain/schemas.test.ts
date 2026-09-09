import { describe, expect, it } from "@jest/globals";

import { bookFormSchema, bookSchema } from "@/domain/book";
import { noteFormSchema } from "@/domain/note";
import { paginatedResponseSchema } from "@/domain/pagination";

const validBook = {
  id: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  titre: "La Horde du Contrevent",
  auteur: "Alain Damasio",
  editeur: "La Volte",
  annee: 2004,
  lu: true,
  favori: false,
  note: 4,
  couverture: "/covers/example.svg",
  createdAt: "2026-09-09T10:00:00.000Z",
  updatedAt: "2026-09-09T10:00:00.000Z",
  version: 1,
};

describe("domain schemas", () => {
  it("accepts a complete book returned by the API", () => {
    expect(bookSchema.parse(validBook)).toEqual(validBook);
  });

  it("rejects an invalid book rating", () => {
    expect(
      bookSchema.safeParse({ ...validBook, note: 6 }).success,
    ).toBe(false);
  });

  it("trims and validates book form fields", () => {
    const result = bookFormSchema.parse({
      titre: "  Dune ",
      auteur: " Frank Herbert ",
      editeur: " Robert Laffont ",
      annee: 1965,
      lu: false,
    });

    expect(result.titre).toBe("Dune");
    expect(result.auteur).toBe("Frank Herbert");
  });

  it("rejects a reading note longer than 1000 characters", () => {
    expect(
      noteFormSchema.safeParse({ contenu: "a".repeat(1001) }).success,
    ).toBe(false);
  });

  it("validates a paginated API response", () => {
    const schema = paginatedResponseSchema(bookSchema);
    const result = schema.parse({
      items: [validBook],
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });

    expect(result.items).toHaveLength(1);
  });
});
