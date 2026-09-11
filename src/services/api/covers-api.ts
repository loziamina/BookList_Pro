/**
 * Envoi et suppression de couverture via PATCH /books/:id.
 * L’API limite `couverture` à 500 caractères : les images base64 sont
 * stockées en localStorage et seules une courte référence est envoyée.
 */
import { AppError } from "@/domain/app-error";
import { Book } from "@/domain/book";

import {
  API_COVER_MAX_CHARS,
  removeLocalCover,
  saveLocalCover,
  toLocalCoverRef,
} from "@/services/covers/local-cover-storage";

import { updateBook } from "./books-api";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
]);

/** Garde-fou mémoire navigateur (pas la limite API de 500). */
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

  if (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  ) {
    if (trimmed.length > API_COVER_MAX_CHARS) {
      throw {
        type: "payload-too-large",
        message: "L'URL de couverture dépasse 500 caractères.",
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

/** Valeur réellement écrite dans l’API (≤ 500 caractères). */
function resolveApiCoverValue(bookId: string, imageData: string): string {
  const trimmed = imageData.trim();

  if (trimmed.length <= API_COVER_MAX_CHARS) {
    removeLocalCover(bookId);
    return trimmed;
  }

  // Photo base64 trop longue pour l’API → stockage navigateur + courte ref.
  saveLocalCover(bookId, trimmed);
  return toLocalCoverRef(bookId);
}

/** Enregistre la couverture (data URI, URL ou chemin) sur le livre. */
export async function uploadBookCover(
  bookId: string,
  imageData: string,
  version?: number,
): Promise<Book> {
  assertCoverPayload(imageData);
  const couverture = resolveApiCoverValue(bookId, imageData);
  return updateBook(bookId, { couverture }, version);
}

/** Efface la couverture sans envoyer `null` (l’API d’origine refuse null). */
export async function deleteBookCover(
  bookId: string,
  version?: number,
): Promise<Book> {
  removeLocalCover(bookId);
  // "" est accepté par l’API (string) ; on normalise ensuite en null pour l’UI.
  const book = await updateBook(bookId, { couverture: "" }, version);
  return { ...book, couverture: null };
}
