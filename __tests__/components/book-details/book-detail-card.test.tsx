import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { BookDetailCard } from "@/components/book-details/book-detail-card";
import { Book } from "@/domain/book";

const book: Book = {
  id: "2e2c3a0d-4ef8-4ef6-9a8d-347de62dd386",
  titre: "La Horde du Contrevent",
  auteur: "Alain Damasio",
  editeur: "La Volte",
  annee: 2004,
  lu: false,
  favori: false,
  note: null,
  couverture: null,
  createdAt: "2026-09-09T10:00:00.000Z",
  updatedAt: "2026-09-09T10:00:00.000Z",
  version: 1,
};

describe("BookDetailCard", () => {
  it("affiche le titre, l'auteur, l'éditeur et l'année", async () => {
    await render(
      <BookDetailCard
        book={book}
        onToggleRead={jest.fn()}
        onEditPress={jest.fn()}
      />,
    );

    expect(screen.getByText("La Horde du Contrevent")).toBeTruthy();
    expect(screen.getByText("Alain Damasio")).toBeTruthy();
    expect(screen.getByText("La Volte")).toBeTruthy();
    expect(screen.getByText("2004")).toBeTruthy();
  });

  it("reflète le statut de lecture actuel dans l'interrupteur", async () => {
    await render(
      <BookDetailCard
        book={{ ...book, lu: true }}
        onToggleRead={jest.fn()}
        onEditPress={jest.fn()}
      />,
    );

    const switchElement = screen.getByLabelText("Statut de lecture");
    expect(switchElement.props.value).toBe(true);
  });

  it("appelle onToggleRead avec la valeur inversée quand on bascule l'interrupteur", async () => {
    const onToggleRead = jest.fn<(nextValue: boolean) => void>();

    await render(
      <BookDetailCard
        book={{ ...book, lu: false }}
        onToggleRead={onToggleRead}
        onEditPress={jest.fn()}
      />,
    );

    await fireEvent(screen.getByLabelText("Statut de lecture"), "valueChange", true);

    expect(onToggleRead).toHaveBeenCalledWith(true);
  });

  it("appelle onEditPress quand on clique sur Modifier", async () => {
    const onEditPress = jest.fn();

    await render(
      <BookDetailCard book={book} onToggleRead={jest.fn()} onEditPress={onEditPress} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: /modifier/i }));

    expect(onEditPress).toHaveBeenCalledTimes(1);
  });
});