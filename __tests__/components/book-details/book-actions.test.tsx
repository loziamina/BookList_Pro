import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { BookActions } from "@/components/book-details/book-actions";

describe("BookActions", () => {
  it("reflète le statut de lecture et appelle onToggleRead", async () => {
    const onToggleRead = jest.fn<(nextValue: boolean) => void>();

    await render(
      <BookActions
        isRead={false}
        onToggleRead={onToggleRead}
        isFavorite={false}
        onToggleFavorite={jest.fn()}
      />,
    );

    const readSwitch = screen.getByLabelText("Statut de lecture");
    expect(readSwitch.props.value).toBe(false);

    await fireEvent(readSwitch, "valueChange", true);
    expect(onToggleRead).toHaveBeenCalledWith(true);
  });

  it("affiche le bon libellé selon le statut de favori et appelle onToggleFavorite", async () => {
    const onToggleFavorite = jest.fn();

    await render(
      <BookActions
        isRead={false}
        onToggleRead={jest.fn()}
        isFavorite={false}
        onToggleFavorite={onToggleFavorite}
      />,
    );

    expect(screen.getByText("Ajouter aux coups de cœur")).toBeTruthy();

    await fireEvent.press(
      screen.getByRole("button", { name: /ajouter aux coups de cœur/i }),
    );

    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it("affiche 'Coup de cœur' quand le livre est déjà favori", async () => {
    await render(
      <BookActions
        isRead={false}
        onToggleRead={jest.fn()}
        isFavorite={true}
        onToggleFavorite={jest.fn()}
      />,
    );

    expect(screen.getByText("Coup de cœur")).toBeTruthy();
  });
});