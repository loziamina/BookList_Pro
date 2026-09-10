import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { act, fireEvent, render, screen } from "@testing-library/react-native";

import {
    DELETE_UNDO_DELAY_MS,
    DeleteBookControl,
} from "@/components/book-details/delete-book-control";

describe("DeleteBookControl", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("demande une confirmation avant de déclencher la suppression", async () => {
    const onConfirmedDelete = jest.fn();

    await render(<DeleteBookControl onConfirmedDelete={onConfirmedDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    );

    expect(
      screen.getByText("Supprimer définitivement cet ouvrage ?"),
    ).toBeTruthy();
    expect(onConfirmedDelete).not.toHaveBeenCalled();
  });

  it("annule la demande de confirmation sans déclencher de suppression", async () => {
    const onConfirmedDelete = jest.fn();

    await render(<DeleteBookControl onConfirmedDelete={onConfirmedDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    );
    await fireEvent.press(screen.getByRole("button", { name: /annuler/i }));

    expect(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    ).toBeTruthy();

    await act(async () => {
      jest.advanceTimersByTime(DELETE_UNDO_DELAY_MS);
    });
    expect(onConfirmedDelete).not.toHaveBeenCalled();
  });

  it("déclenche la suppression réelle après le délai si on n'annule pas", async () => {
    const onConfirmedDelete = jest.fn();

    await render(<DeleteBookControl onConfirmedDelete={onConfirmedDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    );
    await fireEvent.press(screen.getByRole("button", { name: /confirmer/i }));

    expect(onConfirmedDelete).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(DELETE_UNDO_DELAY_MS);
    });

    expect(onConfirmedDelete).toHaveBeenCalledTimes(1);
  });

  it("l'annulation pendant le délai empêche le véritable DELETE", async () => {
    const onConfirmedDelete = jest.fn();

    await render(<DeleteBookControl onConfirmedDelete={onConfirmedDelete} />);

    await fireEvent.press(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    );
    await fireEvent.press(screen.getByRole("button", { name: /confirmer/i }));

    // On annule juste avant la fin du délai.
    await act(async () => {
      jest.advanceTimersByTime(DELETE_UNDO_DELAY_MS - 1000);
    });
    await fireEvent.press(screen.getByRole("button", { name: /annuler/i }));

    // Même en laissant le temps s'écouler entièrement après l'annulation,
    // la suppression ne doit jamais se déclencher.
    await act(async () => {
      jest.advanceTimersByTime(DELETE_UNDO_DELAY_MS);
    });

    expect(onConfirmedDelete).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /supprimer l'ouvrage/i }),
    ).toBeTruthy();
  });
});