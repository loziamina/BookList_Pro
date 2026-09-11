import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";

import { BookCover } from "@/components/book-details/book-cover";
import { FALLBACK_COVER_URL } from "@/services/covers/resolve-cover-url";

describe("BookCover", () => {
  it("affiche la couverture de repli quand couverture est null", async () => {
    await render(<BookCover couverture={null} />);

    const image = screen.getByLabelText("Couverture de l'ouvrage");
    expect(image.props.source.uri).toBe(FALLBACK_COVER_URL);
  });

  it("affiche une URL absolue telle quelle", async () => {
    const url = "https://example.com/couvertures/dune.jpg";

    await render(<BookCover couverture={url} />);

    const image = screen.getByLabelText("Couverture de l'ouvrage");
    expect(image.props.source.uri).toBe(url);
  });

  it("bascule sur la couverture de repli si le chargement échoue", async () => {
    await render(<BookCover couverture="https://example.com/introuvable.jpg" />);

    const image = screen.getByLabelText("Couverture de l'ouvrage");
    await fireEvent(image, "error");

    expect(
      screen.getByLabelText("Couverture de l'ouvrage").props.source.uri,
    ).toBe(FALLBACK_COVER_URL);
  });
});