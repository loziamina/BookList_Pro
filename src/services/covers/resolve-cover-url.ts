/**
 * Résolution d’URL de couverture (image affichée pour un livre).
 * Cas : relatif, absolu, référence locale (localStorage), repli.
 */
import { API_BASE_URL } from "@/services/api/config";

import {
  bookIdFromLocalCoverRef,
  isLocalCoverRef,
  readLocalCover,
} from "./local-cover-storage";

/** Couverture de repli (SVG neutre) quand `couverture` est absente. */
export const FALLBACK_COVER_URL =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <rect width="200" height="300" fill="#d6d3d1"/>
      <text x="100" y="155" text-anchor="middle" fill="#78716c" font-family="sans-serif" font-size="16">
        Pas de couverture
      </text>
    </svg>`.replace(/\s+/g, " "),
  );

function isAbsoluteUrl(value: string): boolean {
  return (
    /^https?:\/\//i.test(value) ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  );
}

/**
 * Transforme la valeur `couverture` du livre en URI affichable.
 * - `local:<id>` → image lue dans localStorage (web)
 * - chemin relatif → préfixé avec l’URL de l’API
 * - URL absolue / data URI → inchangée
 * - null / vide → couverture de repli
 */
export function resolveCoverUrl(
  couverture: string | null | undefined,
): string {
  const value = couverture?.trim();

  if (!value) {
    return FALLBACK_COVER_URL;
  }

  if (isLocalCoverRef(value)) {
    const bookId = bookIdFromLocalCoverRef(value);
    const stored = bookId ? readLocalCover(bookId) : null;
    return stored ?? FALLBACK_COVER_URL;
  }

  if (isAbsoluteUrl(value)) {
    return value;
  }

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${API_BASE_URL}${path}`;
}
