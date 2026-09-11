import { afterEach, describe, expect, it, jest } from "@jest/globals";

import { getOpenLibraryEditionCount } from "@/services/open-library/open-library-api";

function mockJsonResponse(status: number, payload: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn(async () => payload),
  } as unknown as Response;
}

describe("getOpenLibraryEditionCount", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("retourne le nombre d'éditions du premier résultat", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse(200, {
        numFound: 1,
        docs: [{ title: "Dune", edition_count: 42 }],
      }),
    );

    await expect(getOpenLibraryEditionCount("Dune")).resolves.toEqual({
      editionCount: 42,
      available: true,
    });
  });

  it("traite zéro édition comme un résultat normal", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockJsonResponse(200, {
        numFound: 1,
        docs: [{ title: "Obscur", edition_count: 0 }],
      }),
    );

    await expect(getOpenLibraryEditionCount("Obscur")).resolves.toEqual({
      editionCount: 0,
      available: true,
    });
  });

  it("ne casse pas la fiche si Open Library échoue", async () => {
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("offline"));

    await expect(getOpenLibraryEditionCount("Dune")).resolves.toEqual({
      editionCount: 0,
      available: false,
    });
  });
});
