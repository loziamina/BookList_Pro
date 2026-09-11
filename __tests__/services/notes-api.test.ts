import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Note } from "@/domain/note";
import {
  createNote,
  deleteNote,
  getNotes,
} from "@/services/api/notes-api";
import { apiRequest } from "@/services/api/client";

jest.mock("@/services/api/client", () => ({
  apiRequest: jest.fn(),
}));

const note: Note = {
  id: "3f3c3a0d-4ef8-4ef6-9a8d-347de62dd387",
  livreId: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  contenu: "Une note de lecture.",
  createdAt: "2026-09-11T10:00:00.000Z",
};

const mockedApiRequest = jest.mocked(apiRequest);

describe("notes API service", () => {
  beforeEach(() => {
    mockedApiRequest.mockReset();
  });

  it("récupère les notes d'un ouvrage", async () => {
    mockedApiRequest.mockResolvedValue([note]);

    await expect(getNotes(note.livreId)).resolves.toEqual([note]);

    expect(mockedApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/books/${note.livreId}/notes`,
      }),
    );
  });

  it("crée une note de lecture", async () => {
    mockedApiRequest.mockResolvedValue(note);

    await createNote(note.livreId, { contenu: note.contenu });

    expect(mockedApiRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        path: `/books/${note.livreId}/notes`,
        method: "POST",
        body: { contenu: note.contenu },
      }),
    );
  });

  it("supprime une note de lecture", async () => {
    mockedApiRequest.mockResolvedValue(undefined);

    await deleteNote(note.livreId, note.id);

    expect(mockedApiRequest).toHaveBeenCalledWith({
      path: `/books/${note.livreId}/notes/${note.id}`,
      method: "DELETE",
      schema: null,
    });
  });
});
