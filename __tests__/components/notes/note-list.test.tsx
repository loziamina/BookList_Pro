import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";

import { NoteList } from "@/components/notes/note-list";
import { Note } from "@/domain/note";

const olderNote: Note = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  livreId: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  contenu: "Première lecture, il y a longtemps.",
  createdAt: "2026-01-01T10:00:00.000Z",
};

const recentNote: Note = {
  id: "6c9f0e2e-9b8b-4c8a-9d2b-6a1f3d9a0b11",
  livreId: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  contenu: "Relecture toute fraîche.",
  createdAt: "2026-09-10T10:00:00.000Z",
};

describe("NoteList", () => {
  it("affiche un état vide contextualisé quand il n'y a aucune note", async () => {
    await render(<NoteList notes={[]} onDeleteNote={jest.fn()} />);

    expect(
      screen.getByText("Aucune note de lecture pour cet ouvrage pour l'instant."),
    ).toBeTruthy();
  });

  it("affiche les notes de la plus récente à la plus ancienne", async () => {
    await render(
      <NoteList notes={[olderNote, recentNote]} onDeleteNote={jest.fn()} />,
    );

    const renderedTexts = screen.getAllByText(/lecture|Relecture/i);
    const firstText = renderedTexts[0]?.props.children as string;

    expect(firstText).toBe("Relecture toute fraîche.");
  });
});