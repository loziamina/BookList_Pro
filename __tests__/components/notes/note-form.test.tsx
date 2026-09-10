import { describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react-native";

import { NoteForm } from "@/components/notes/note-form";
import { NoteFormData } from "@/domain/note";

describe("NoteForm", () => {
  it("affiche une erreur si on tente d'envoyer une note vide", async () => {
    const onSubmit = jest.fn<(data: NoteFormData) => void>();

    await render(<NoteForm onSubmit={onSubmit} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /ajouter la note/i }),
    );

    expect(
      await screen.findByText("La note de lecture ne peut pas être vide."),
    ).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("empêche la saisie au-delà de 1000 caractères", async () => {
    const onSubmit = jest.fn<(data: NoteFormData) => void>();

    await render(<NoteForm onSubmit={onSubmit} />);

    const tooLong = "a".repeat(1200);
    const input = screen.getByPlaceholderText("Écrire une note de lecture…");

    await fireEvent.changeText(input, tooLong);

    expect(screen.getByText("1000 / 1000")).toBeTruthy();
  });

  it("appelle onSubmit avec le contenu saisi puis réinitialise le champ", async () => {
    const onSubmit = jest.fn<(data: NoteFormData) => void>();

    await render(<NoteForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("Écrire une note de lecture…");
    await fireEvent.changeText(input, "Une très bonne surprise.");
    await fireEvent.press(
      screen.getByRole("button", { name: /ajouter la note/i }),
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        contenu: "Une très bonne surprise.",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("0 / 1000")).toBeTruthy();
    });
  });

  it("désactive la soumission pendant l'envoi", async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    await render(<NoteForm onSubmit={onSubmit} />);

    const input = screen.getByPlaceholderText("Écrire une note de lecture…");
    await fireEvent.changeText(input, "Note en cours d'envoi.");

    const button = screen.getByRole("button", { name: /ajouter la note/i });
    const firstPress = fireEvent.press(button);

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    await act(async () => {
      resolveSubmit();
    });
    await firstPress;
  });
});