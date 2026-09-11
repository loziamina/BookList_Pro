import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { z } from "zod";

import { apiRequest } from "@/services/api/client";

function mockResponse(status: number, payload?: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: jest.fn(async () =>
      payload === undefined ? "" : JSON.stringify(payload),
    ),
  } as unknown as Response;
}

describe("apiRequest", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("envoie le JSON et valide une réponse réussie", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse(201, { id: "livre-1" }),
    );
    const schema = z.object({ id: z.string() });

    await expect(
      apiRequest({
        path: "/books",
        method: "POST",
        body: { titre: "Dune" },
        schema,
      }),
    ).resolves.toEqual({ id: "livre-1" });

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/books",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ titre: "Dune" }),
        headers: expect.objectContaining({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("accepte une réponse 204 lorsqu'aucun contenu n'est attendu", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(mockResponse(204));

    await expect(
      apiRequest({
        path: "/books/livre-1",
        method: "DELETE",
        schema: null,
      }),
    ).resolves.toBeUndefined();
  });

  it("convertit une erreur 422 en erreurs par champ", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse(422, {
        erreur: "validation",
        champs: {
          titre: "champ obligatoire",
          annee: "année invalide",
        },
      }),
    );

    await expect(
      apiRequest({
        path: "/books",
        method: "POST",
        body: {},
        schema: z.object({ id: z.string() }),
      }),
    ).rejects.toMatchObject({
      type: "validation",
      status: 422,
      fields: {
        titre: "champ obligatoire",
        annee: "année invalide",
      },
    });
  });

  it("convertit une erreur 409 en conflit versionné", async () => {
    const serverBook = { id: "livre-1", version: 4 };
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse(409, {
        erreur: "conflit",
        message: "Le livre a été modifié.",
        serveur: serverBook,
        versionAttendue: 4,
      }),
    );

    await expect(
      apiRequest({
        path: "/books/livre-1",
        method: "PUT",
        body: {},
        schema: z.object({ id: z.string() }),
      }),
    ).rejects.toMatchObject({
      type: "conflict",
      status: 409,
      serverData: serverBook,
      expectedVersion: 4,
    });
  });

  it("marque une erreur 503 comme réessayable", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse(503, {
        erreur: "indisponible",
        message: "Service temporairement indisponible.",
      }),
    );

    await expect(
      apiRequest({
        path: "/books",
        schema: z.object({ items: z.array(z.unknown()) }),
      }),
    ).rejects.toMatchObject({
      type: "network",
      retryable: true,
      status: 503,
    });
  });

  it("refuse une réponse qui ne respecte pas son schéma Zod", async () => {
    jest.spyOn(globalThis, "fetch").mockResolvedValue(
      mockResponse(200, { id: 42 }),
    );

    await expect(
      apiRequest({
        path: "/books/livre-1",
        schema: z.object({ id: z.string() }),
      }),
    ).rejects.toMatchObject({
      type: "unknown",
      message: "La réponse du serveur ne respecte pas le contrat attendu.",
    });
  });

  it("convertit un échec de fetch en erreur réseau", async () => {
    jest
      .spyOn(globalThis, "fetch")
      .mockRejectedValue(new TypeError("Network request failed"));

    await expect(
      apiRequest({
        path: "/books",
        schema: z.object({ items: z.array(z.unknown()) }),
      }),
    ).rejects.toMatchObject({
      type: "network",
      retryable: true,
    });
  });
});
