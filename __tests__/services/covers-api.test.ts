import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  deleteBookCover,
  uploadBookCover,
} from "@/services/api/covers-api";
import { updateBook } from "@/services/api/books-api";
import {
  localCoverStorageKey,
  toLocalCoverRef,
} from "@/services/covers/local-cover-storage";

jest.mock("@/services/api/books-api", () => ({
  updateBook: jest.fn(),
}));

const memoryStore = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => memoryStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memoryStore.set(key, value);
    },
    removeItem: (key: string) => {
      memoryStore.delete(key);
    },
    clear: () => {
      memoryStore.clear();
    },
  },
  configurable: true,
});

const updateBookMock = updateBook as jest.MockedFunction<typeof updateBook>;

describe("covers-api", () => {
  beforeEach(() => {
    updateBookMock.mockReset();
    memoryStore.clear();
  });

  it("envoie une petite couverture directement à l'API", async () => {
    updateBookMock.mockResolvedValue({ id: "livre-1" } as never);
    const small = "data:image/png;base64,aGVsbG8=";

    await uploadBookCover("livre-1", small, 2);

    expect(updateBookMock).toHaveBeenCalledWith(
      "livre-1",
      { couverture: small },
      2,
    );
  });

  it("stocke une grande image en local et n'envoie qu'une référence courte", async () => {
    updateBookMock.mockResolvedValue({
      id: "livre-1",
      couverture: toLocalCoverRef("livre-1"),
    } as never);

    const heavy = `data:image/png;base64,${"a".repeat(600)}`;
    await uploadBookCover("livre-1", heavy, 2);

    expect(memoryStore.get(localCoverStorageKey("livre-1"))).toBe(heavy);

    expect(updateBookMock).toHaveBeenCalledWith(
      "livre-1",
      { couverture: toLocalCoverRef("livre-1") },
      2,
    );
    expect(toLocalCoverRef("livre-1").length).toBeLessThanOrEqual(500);
  });

  it("refuse un format non supporté (415)", async () => {
    await expect(
      uploadBookCover("livre-1", "data:application/pdf;base64,aaa"),
    ).rejects.toMatchObject({
      type: "unsupported-media",
      status: 415,
    });
    expect(updateBookMock).not.toHaveBeenCalled();
  });

  it("refuse une image trop lourde pour le navigateur (413)", async () => {
    const heavy = `data:image/png;base64,${"a".repeat(1_500_001)}`;

    await expect(uploadBookCover("livre-1", heavy)).rejects.toMatchObject({
      type: "payload-too-large",
      status: 413,
    });
    expect(updateBookMock).not.toHaveBeenCalled();
  });

  it("supprime la couverture API et le stockage local", async () => {
    memoryStore.set(localCoverStorageKey("livre-1"), "data:image/png;base64,xx");
    updateBookMock.mockResolvedValue({
      id: "livre-1",
      couverture: "",
    } as never);

    await expect(deleteBookCover("livre-1", 4)).resolves.toMatchObject({
      id: "livre-1",
      couverture: null,
    });

    expect(memoryStore.get(localCoverStorageKey("livre-1"))).toBeUndefined();
    expect(updateBookMock).toHaveBeenCalledWith(
      "livre-1",
      { couverture: "" },
      4,
    );
  });
});
