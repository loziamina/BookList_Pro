import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  deleteBookCover,
  uploadBookCover,
} from "@/services/api/covers-api";
import { updateBook } from "@/services/api/books-api";

jest.mock("@/services/api/books-api", () => ({
  updateBook: jest.fn(),
}));

const updateBookMock = updateBook as jest.MockedFunction<typeof updateBook>;

describe("covers-api", () => {
  beforeEach(() => {
    updateBookMock.mockReset();
  });

  it("envoie une couverture base64 valide via PATCH", async () => {
    updateBookMock.mockResolvedValue({ id: "livre-1" } as never);

    await uploadBookCover(
      "livre-1",
      "data:image/png;base64,aGVsbG8=",
      2,
    );

    expect(updateBookMock).toHaveBeenCalledWith(
      "livre-1",
      { couverture: "data:image/png;base64,aGVsbG8=" },
      2,
    );
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

  it("refuse une image trop lourde (413)", async () => {
    const heavy = `data:image/png;base64,${"a".repeat(1_500_001)}`;

    await expect(uploadBookCover("livre-1", heavy)).rejects.toMatchObject({
      type: "payload-too-large",
      status: 413,
    });
    expect(updateBookMock).not.toHaveBeenCalled();
  });

  it("supprime la couverture en passant null", async () => {
    updateBookMock.mockResolvedValue({ id: "livre-1", couverture: null } as never);

    await deleteBookCover("livre-1", 4);

    expect(updateBookMock).toHaveBeenCalledWith(
      "livre-1",
      { couverture: null },
      4,
    );
  });
});
