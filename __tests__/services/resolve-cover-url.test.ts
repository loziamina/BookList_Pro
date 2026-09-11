import { afterEach, describe, expect, it } from "@jest/globals";

import {
  localCoverStorageKey,
  toLocalCoverRef,
} from "@/services/covers/local-cover-storage";
import {
  FALLBACK_COVER_URL,
  resolveCoverUrl,
} from "@/services/covers/resolve-cover-url";

const memoryStore = new Map<string, string>();

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: (key: string) => memoryStore.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memoryStore.set(key, value);
    },
    removeItem: (key: string) => {
      memoryStore.delete(key);
    },
    clear: () => {
      memoryStore.clear();
    },
  },
  configurable: true,
});

describe("resolveCoverUrl", () => {
  afterEach(() => {
    memoryStore.clear();
  });

  it("préfixe un chemin relatif avec l'URL de l'API", () => {
    expect(resolveCoverUrl("/covers/dune.svg")).toBe(
      "http://localhost:3000/covers/dune.svg",
    );
  });

  it("conserve une URL absolue ou un data URI", () => {
    expect(resolveCoverUrl("https://cdn.example.com/dune.jpg")).toBe(
      "https://cdn.example.com/dune.jpg",
    );
  });

  it("lit une couverture locale depuis localStorage", () => {
    const dataUrl = "data:image/jpeg;base64,prince";
    memoryStore.set(localCoverStorageKey("livre-1"), dataUrl);
    expect(resolveCoverUrl(toLocalCoverRef("livre-1"))).toBe(dataUrl);
  });

  it("fournit une couverture de repli si la valeur est absente", () => {
    expect(resolveCoverUrl(null)).toBe(FALLBACK_COVER_URL);
    expect(resolveCoverUrl(toLocalCoverRef("inconnu"))).toBe(FALLBACK_COVER_URL);
  });
});
