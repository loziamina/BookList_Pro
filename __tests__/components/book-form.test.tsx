import { describe, expect, it, jest } from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

import { BookForm } from "@/components/forms/book-form";
import { BookFormData } from "@/domain/book";

describe("BookForm", () => {
  it("affiche une erreur sous chaque champ obligatoire vide", async () => {
    const onSubmit = jest.fn<(data: BookFormData) => void>();

    await render(<BookForm submitLabel="Ajouter" onSubmit={onSubmit} />);

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: /ajouter/i }));
    });

    expect(await screen.findByText("Le titre est obligatoire.")).toBeTruthy();
    expect(screen.getByText("L'auteur est obligatoire.")).toBeTruthy();
    expect(screen.getByText("L'éditeur est obligatoire.")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("appelle onSubmit avec les données saisies quand le formulaire est valide", async () => {
    const onSubmit = jest.fn<(data: BookFormData) => void>();

    await render(<BookForm submitLabel="Ajouter" onSubmit={onSubmit} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText("Titre de l'ouvrage"),
      "Dune",
    );
    await fireEvent.changeText(screen.getByPlaceholderText("Auteur"), "Frank Herbert");
    await fireEvent.changeText(
      screen.getByPlaceholderText("Éditeur"),
      "Robert Laffont",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("Année de publication"),
      "1965",
    );

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: /ajouter/i }));
    });

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          titre: "Dune",
          auteur: "Frank Herbert",
          editeur: "Robert Laffont",
          annee: 1965,
          lu: false,
        }),
      );
    });
  });

  it("affiche les erreurs 422 renvoyées par l'API sous les bons champs", async () => {
    const onSubmit = jest.fn<(data: BookFormData) => void>();

    await render(
      <BookForm
        submitLabel="Ajouter"
        onSubmit={onSubmit}
        serverErrors={{
          titre: "Ce titre existe déjà.",
          annee: "L'année est invalide.",
        }}
      />,
    );

    expect(await screen.findByText("Ce titre existe déjà.")).toBeTruthy();
    expect(screen.getByText("L'année est invalide.")).toBeTruthy();
  });

  it("désactive le bouton pendant l'envoi pour empêcher une double soumission", async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        }),
    );

    await render(<BookForm submitLabel="Ajouter" onSubmit={onSubmit} />);

    await fireEvent.changeText(
      screen.getByPlaceholderText("Titre de l'ouvrage"),
      "Dune",
    );
    await fireEvent.changeText(screen.getByPlaceholderText("Auteur"), "Frank Herbert");
    await fireEvent.changeText(
      screen.getByPlaceholderText("Éditeur"),
      "Robert Laffont",
    );
    await fireEvent.changeText(
      screen.getByPlaceholderText("Année de publication"),
      "1965",
    );

    const button = screen.getByRole("button", { name: /ajouter/i });
    // onSubmit reste en attente tant qu'on n'appelle pas resolveSubmit() :
    // on ne peut donc pas attendre cette promesse tout de suite.
    await act(async () => {
      fireEvent.press(button);
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });

    // Une deuxième pression pendant l'envoi ne doit pas déclencher un second appel.
    fireEvent.press(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSubmit();
    });

    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });
});