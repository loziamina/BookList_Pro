/**
 * Envoi et suppression de couverture via PATCH /books/:id.
 */
import { AppError } from "@/domain/app-error";
import { Book } from "@/domain/book";

import { updateBook } from "./books-api";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

/** Limite alignée sur le body JSON de l’API (express 2mb) avec marge. */
export const MAX_COVER_PAYLOAD_CHARS = 1_500_000;

const DATA_URL_PATTERN =
  /^data:(image\/[a-z0-9.+-]+);base64,([a-z0-9+/=\s]+)$/i;

function assertCoverPayload(imageData: string): void {
  const trimmed = imageData.trim();

  if (!trimmed) {
    throw {
      type: "validation",
      message: "Aucune image de couverture fournie.",
      fields: { couverture: "image obligatoire" },
      status: 422,
    } satisfies AppError;
  }

  // URL ou chemin court : pas de contrôle MIME base64.
  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    if (trimmed.length > MAX_COVER_PAYLOAD_CHARS) {
      throw {
        type: "payload-too-large",
        message: "L'image est trop lourde.",
        status: 413,
      } satisfies AppError;
    }
    return;
  }

  const match = DATA_URL_PATTERN.exec(trimmed);
  if (!match) {
    throw {
      type: "unsupported-media",
      message: "Format d'image refusé. Utilisez JPEG, PNG, WebP ou SVG.",
      status: 415,
    } satisfies AppError;
  }

  const mime = match[1].toLowerCase();
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    throw {
      type: "unsupported-media",
      message: "Format d'image refusé. Utilisez JPEG, PNG, WebP ou SVG.",
      status: 415,
    } satisfies AppError;
  }

  if (trimmed.length > MAX_COVER_PAYLOAD_CHARS) {
    throw {
      type: "payload-too-large",
      message: "L'image est trop lourde.",
      status: 413,
    } satisfies AppError;
  }
}

/** Enregistre la couverture (data URI, URL ou chemin) sur le livre. */
export async function uploadBookCover(
  bookId: string,
  imageData: string,
  version?: number,
): Promise<Book> {
  assertCoverPayload(imageData);
  return updateBook(bookId, { couverture: imageData.trim() }, version);
}

/** Repasse la couverture à null (retour possible à l’état d’origine côté UI). */
export async function deleteBookCover(
  bookId: string,
  version?: number,
): Promise<Book> {
  return updateBook(bookId, { couverture: null }, version);
}
