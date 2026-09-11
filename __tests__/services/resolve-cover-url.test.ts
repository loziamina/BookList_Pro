import { describe, expect, it } from "@jest/globals";

import {
  FALLBACK_COVER_URL,
  resolveCoverUrl,
} from "@/services/covers/resolve-cover-url";

describe("resolveCoverUrl", () => {
  it("préfixe un chemin relatif avec l'URL de l'API", () => {
    expect(resolveCoverUrl("/covers/dune.svg")).toBe(
      "http://localhost:3000/covers/dune.svg",
    );
    expect(resolveCoverUrl("covers/dune.svg")).toBe(
      "http://localhost:3000/covers/dune.svg",
    );
  });

  it("conserve une URL absolue ou un data URI", () => {
    expect(resolveCoverUrl("https://cdn.example.com/dune.jpg")).toBe(
      "https://cdn.example.com/dune.jpg",
    );
    expect(
      resolveCoverUrl("data:image/png;base64,abc"),
    ).toBe("data:image/png;base64,abc");
  });

  it("fournit une couverture de repli si la valeur est absente", () => {
    expect(resolveCoverUrl(null)).toBe(FALLBACK_COVER_URL);
    expect(resolveCoverUrl(undefined)).toBe(FALLBACK_COVER_URL);
    expect(resolveCoverUrl("   ")).toBe(FALLBACK_COVER_URL);
  });
});
