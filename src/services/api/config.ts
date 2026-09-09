const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = (
  configuredApiUrl ?? "http://localhost:3000"
).replace(/\/$/, "");

export const API_TIMEOUT_MS = 8_000;
