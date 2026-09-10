import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { NoteCard } from "@/components/notes/note-card";
import { Note } from "@/domain/note";

const note: Note = {
  id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  livreId: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  contenu: "Un roman fleuve exigeant mais superbe.",
  createdAt: "2026-09-10T14:30:00.000Z",
};

describe("NoteCard", () => {
  it("affiche le contenu de la note", async () => {
    await render(<NoteCard note={note} onDelete={jest.fn()} />);

    expect(
      screen.getByText("Un roman fleuve exigeant mais superbe."),
    ).toBeTruthy();
  });

  it("demande une confirmation avant de supprimer, sans appeler onDelete immédiatement", async () => {
    const onDelete = jest.fn();

    await render(<NoteCard note={note} onDelete={onDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer la note/i }),
    );

    expect(screen.getByText("Supprimer cette note ?")).toBeTruthy();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("annule la confirmation sans appeler onDelete", async () => {
    const onDelete = jest.fn();

    await render(<NoteCard note={note} onDelete={onDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer la note/i }),
    );
    await fireEvent.press(screen.getByRole("button", { name: /^annuler$/i }));

    expect(
      screen.getByRole("button", { name: /supprimer la note/i }),
    ).toBeTruthy();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("appelle onDelete avec l'identifiant de la note après confirmation", async () => {
    const onDelete = jest.fn<(noteId: string) => void>();

    await render(<NoteCard note={note} onDelete={onDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer la note/i }),
    );
    await fireEvent.press(screen.getByRole("button", { name: /^confirmer$/i }));

    expect(onDelete).toHaveBeenCalledWith(note.id);
  });
});