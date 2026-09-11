import { describe, expect, it } from "@jest/globals";

import { isAppError } from "@/domain/app-error";

describe("isAppError", () => {
  it("reconnaît une erreur applicative discriminée", () => {
    expect(
      isAppError({
        type: "network",
        message: "Serveur indisponible",
        retryable: true,
      }),
    ).toBe(true);
  });

  it.each([null, "erreur", {}, { type: "inconnue" }])(
    "refuse une valeur qui n'est pas une erreur applicative",
    (value) => {
      expect(isAppError(value)).toBe(false);
    },
  );
});
