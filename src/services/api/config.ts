/**
 * Config HTTP.
 * URL via EXPO_PUBLIC_API_URL (.env.local), sinon localhost:3000 (api-books-v2).
 */
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = (
  configuredApiUrl ?? "http://localhost:3000"
).replace(/\/$/, "");

/** Timeout global : au-delà, le client abort et renvoie une AppError réseau retryable. */
export const API_TIMEOUT_MS = 8_000;
