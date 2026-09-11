/**
 * Stockage local des couvertures trop longues pour l’API (max 500 caractères).
 * L’API garde une courte référence `local:<bookId>` ; l’image reste dans localStorage (web).
 */
export const API_COVER_MAX_CHARS = 500;
export const LOCAL_COVER_PREFIX = "local:";

export function toLocalCoverRef(bookId: string): string {
  return `${LOCAL_COVER_PREFIX}${bookId}`;
}

export function isLocalCoverRef(value: string): boolean {
  return value.startsWith(LOCAL_COVER_PREFIX);
}

export function localCoverStorageKey(bookId: string): string {
  return `booklist.cover.${bookId}`;
}

function canUseLocalStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function saveLocalCover(bookId: string, imageData: string): void {
  if (!canUseLocalStorage()) {
    throw new Error("Stockage local indisponible pour cette couverture.");
  }
  localStorage.setItem(localCoverStorageKey(bookId), imageData);
}

export function readLocalCover(bookId: string): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }
  return localStorage.getItem(localCoverStorageKey(bookId));
}

export function removeLocalCover(bookId: string): void {
  if (!canUseLocalStorage()) {
    return;
  }
  localStorage.removeItem(localCoverStorageKey(bookId));
}

export function bookIdFromLocalCoverRef(value: string): string | null {
  if (!isLocalCoverRef(value)) {
    return null;
  }
  const id = value.slice(LOCAL_COVER_PREFIX.length).trim();
  return id.length > 0 ? id : null;
}
