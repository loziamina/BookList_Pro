import { afterEach, describe, expect, it, jest } from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
} from "@testing-library/react-native";
import { Text } from "react-native";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";

describe("GlobalErrorBoundary", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("affiche un secours puis permet de réessayer", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const onError = jest.fn();
    let shouldThrow = true;

    function TestContent() {
      if (shouldThrow) {
        throw new Error("Erreur de rendu simulée");
      }

      return <Text>Contenu restauré</Text>;
    }

    await render(
      <GlobalErrorBoundary onError={onError}>
        <TestContent />
      </GlobalErrorBoundary>,
    );

    expect(
      screen.getByText("Une erreur inattendue est survenue"),
    ).toBeTruthy();
    expect(onError).toHaveBeenCalledTimes(1);

    shouldThrow = false;
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Réessayer" }));
    });

    expect(screen.getByText("Contenu restauré")).toBeTruthy();
  });
});
