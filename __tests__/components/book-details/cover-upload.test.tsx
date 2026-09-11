import { afterAll, beforeAll, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Platform } from "react-native";

import { CoverUpload } from "@/components/book-details/cover-upload";

describe("CoverUpload sur navigateur", () => {
  const originalOS = Platform.OS;

  beforeAll(() => {
    Object.defineProperty(Platform, "OS", { value: "web", configurable: true });
  });

  afterAll(() => {
    Object.defineProperty(Platform, "OS", { value: originalOS, configurable: true });
  });

  it("propose de changer la couverture", async () => {
    await render(
      <CoverUpload hasCover={false} onUpload={jest.fn<(imageDataUrl: string) => void>()} onRemove={jest.fn()} />,
    );

    expect(screen.getByText("Changer la couverture")).toBeTruthy();
  });

  it("n'affiche le bouton de retrait que si une couverture existe déjà", async () => {
    const { rerender } = await render(
      <CoverUpload hasCover={false} onUpload={jest.fn<(imageDataUrl: string) => void>()} onRemove={jest.fn()} />,
    );

    expect(screen.queryByText("Retirer la couverture")).toBeNull();

    await rerender(
      <CoverUpload hasCover onUpload={jest.fn<(imageDataUrl: string) => void>()} onRemove={jest.fn()} />,
    );

    expect(screen.getByText("Retirer la couverture")).toBeTruthy();
  });

  it("appelle onRemove quand on clique sur Retirer la couverture", async () => {
    const onRemove = jest.fn();

    await render(
      <CoverUpload hasCover onUpload={jest.fn<(imageDataUrl: string) => void>()} onRemove={onRemove} />,
    );

    await fireEvent.press(screen.getByText("Retirer la couverture"));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("affiche l'erreur transmise par le parent (413, 415, réseau...)", async () => {
    await render(
      <CoverUpload
        hasCover={false}
        onUpload={jest.fn<(imageDataUrl: string) => void>()}
        onRemove={jest.fn()}
        uploadError="Format d'image refusé. Utilisez JPEG, PNG, WebP ou SVG."
      />,
    );

    expect(
      screen.getByText("Format d'image refusé. Utilisez JPEG, PNG, WebP ou SVG."),
    ).toBeTruthy();
  });
});

describe("CoverUpload hors navigateur", () => {
  it("affiche un message de dégradation propre plutôt que de planter", async () => {
    await render(
      <CoverUpload hasCover={false} onUpload={jest.fn<(imageDataUrl: string) => void>()} onRemove={jest.fn()} />,
    );

    expect(
      screen.getByText(
        "L'envoi d'une couverture n'est disponible que sur navigateur.",
      ),
    ).toBeTruthy();
  });
});