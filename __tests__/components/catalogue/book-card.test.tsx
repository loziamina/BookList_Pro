import { fireEvent, screen } from "@testing-library/react-native";

import { BookCard } from "@/components/catalogue/book-card";
import type { Book } from "@/domain/book";

import { renderWithProviders } from "../../../test-utils/render-with-providers";

const book: Book = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  titre: "Le Seigneur des Anneaux",
  auteur: "J.R.R. Tolkien",
  editeur: "Christian Bourgois",
  annee: 1954,
  lu: true,
  favori: true,
  note: 5,
  couverture: null,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  version: 1,
};

describe("BookCard", () => {
  it("affiche le titre, l'auteur et le statut de lecture", () => {
    renderWithProviders(
      <BookCard book={book} onPress={() => {}} onToggleFavorite={() => {}} />,
    );

    expect(screen.getByText("Le Seigneur des Anneaux")).toBeTruthy();
    expect(screen.getByText("J.R.R. Tolkien")).toBeTruthy();
    expect(screen.getByText("Lu")).toBeTruthy();
  });

  it("appelle onPress avec l'identifiant du livre au clic", () => {
    const onPress = jest.fn();
    renderWithProviders(
      <BookCard book={book} onPress={onPress} onToggleFavorite={() => {}} />,
    );

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledWith(book.id);
  });
});
