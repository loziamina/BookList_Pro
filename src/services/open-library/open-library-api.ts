/**
 * Client Open Library (API externe).
 * Timeout + AbortSignal ; un échec renvoie available: false sans faire planter la fiche.
 */
import {
  OpenLibraryEditionsResult,
  openLibrarySearchSchema,
} from "@/domain/open-library";

const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_TIMEOUT_MS = 8_000;

export async function getOpenLibraryEditionCount(
  title: string,
  signal?: AbortSignal,
): Promise<OpenLibraryEditionsResult> {
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    return { editionCount: 0, available: true };
  }

  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(signal?.reason);

  if (signal?.aborted) {
    abortFromCaller();
  } else {
    signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OPEN_LIBRARY_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      title: trimmedTitle,
      limit: "1",
      fields: "title,edition_count",
    });

    const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      return { editionCount: 0, available: false };
    }

    const payload: unknown = await response.json();
    const parsed = openLibrarySearchSchema.safeParse(payload);

    if (!parsed.success) {
      return { editionCount: 0, available: false };
    }

    const firstDoc = parsed.data.docs[0];
    return {
      editionCount: firstDoc?.edition_count ?? 0,
      available: true,
    };
  } catch {
    if (timedOut || controller.signal.aborted) {
      return { editionCount: 0, available: false };
    }

    return { editionCount: 0, available: false };
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}
