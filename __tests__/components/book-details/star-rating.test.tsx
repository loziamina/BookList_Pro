import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { StarRating } from "@/components/book-details/star-rating";

describe("StarRating", () => {
  it("affiche 'Pas encore noté' quand la note est nulle", async () => {
    await render(<StarRating rating={null} onRate={jest.fn()} />);

    expect(screen.getByText("Pas encore noté")).toBeTruthy();
  });

  it("affiche la note actuelle sur 5", async () => {
    await render(<StarRating rating={3} onRate={jest.fn()} />);

    expect(screen.getByText("3 / 5")).toBeTruthy();
  });

  it("appelle onRate avec la valeur de l'étoile pressée", async () => {
    const onRate = jest.fn<(value: number) => void>();

    await render(<StarRating rating={null} onRate={onRate} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /noter 4 étoiles sur 5/i }),
    );

    expect(onRate).toHaveBeenCalledWith(4);
  });

  it("désactive les étoiles pendant l'enregistrement", async () => {
    const onRate = jest.fn();

    await render(<StarRating rating={2} onRate={onRate} isSaving />);

    expect(
      screen.getByRole("button", { name: /noter 1 étoile sur 5/i }),
    ).toBeDisabled();
  });
});