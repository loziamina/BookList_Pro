/**
 * Client HTTP unique.
 * - Une seule entrée pour fetch, timeout, parsing JSON
 * - Validation Zod de chaque réponse succès
 * - Mapping HTTP → AppError (422 champs, 409 conflit, 503 retryable…)
 * - Annulation : timeout interne + signal TanStack Query (recherche / navigation)
 */
import { z } from "zod";

import { AppError, isAppError } from "@/domain/app-error";

import { API_BASE_URL, API_TIMEOUT_MS } from "./config";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type CommonRequestOptions = {
  path: string;
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Signal Query / UI : annule la requête précédente (ex. nouvelle recherche). */
  signal?: AbortSignal;
};

export type DataRequestOptions<T> = CommonRequestOptions & {
  schema: z.ZodType<T>;
};

/** DELETE / 204 : pas de corps à valider. */
export type NoContentRequestOptions = CommonRequestOptions & {
  schema: null;
};

/** Forme d’erreur renvoyée par api-books-v2 (champs FR). */
const apiErrorPayloadSchema = z.object({
  erreur: z.string().optional(),
  message: z.string().optional(),
  champs: z.record(z.string(), z.string()).optional(),
  serveur: z.unknown().optional(),
  versionAttendue: z.number().int().optional(),
});

/** Convertit un status HTTP + payload JSON en AppError typée. */
function createHttpError(status: number, payload: unknown): AppError {
  const parsedPayload = apiErrorPayloadSchema.safeParse(payload);
  const details = parsedPayload.success ? parsedPayload.data : undefined;
  const message = details?.message ?? "Une erreur inattendue est survenue.";

  if (status === 401 || status === 403) {
    return { type: "auth", message, status };
  }

  if (status === 404) {
    return { type: "not-found", message, status };
  }

  if (status === 409) {
    return {
      type: "conflict",
      message,
      serverData: details?.serveur,
      expectedVersion: details?.versionAttendue,
      status,
    };
  }

  if (status === 422) {
    return {
      type: "validation",
      message,
      fields: details?.champs ?? {},
      status,
    };
  }

  // Mode chaos / surcharge : retryable pour TanStack Query.
  if (status === 413) {
    return {
      type: "payload-too-large",
      message: details?.message ?? "L'image est trop lourde.",
      status,
    };
  }

  if (status === 415) {
    return {
      type: "unsupported-media",
      message: details?.message ?? "Ce format d'image n'est pas accepté.",
      status,
    };
  }

  if (status === 503) {
    return { type: "network", message, retryable: true, status };
  }

  return { type: "unknown", message, status };
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw {
      type: "unknown",
      message: "Le serveur a renvoyé une réponse JSON illisible.",
      status: response.status,
    } satisfies AppError;
  }
}

export function apiRequest(
  options: NoContentRequestOptions,
): Promise<void>;
export function apiRequest<T>(options: DataRequestOptions<T>): Promise<T>;
export async function apiRequest<T>(
  options: DataRequestOptions<T> | NoContentRequestOptions,
): Promise<T | void> {
  // Contrôleur local : combine timeout + signal externe.
  const controller = new AbortController();
  let timedOut = false;
  const abortFromCaller = () => controller.abort(options.signal?.reason);

  if (options.signal?.aborted) {
    abortFromCaller();
  } else {
    options.signal?.addEventListener("abort", abortFromCaller, { once: true });
  }

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_TIMEOUT_MS);

  try {
    const hasBody = options.body !== undefined;
    const response = await fetch(`${API_BASE_URL}${options.path}`, {
      method: options.method ?? "GET",
      body: hasBody ? JSON.stringify(options.body) : undefined,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (response.status === 204) {
      if (options.schema !== null) {
        throw {
          type: "unknown",
          message: "Le serveur n'a renvoyé aucune donnée.",
          status: response.status,
        } satisfies AppError;
      }

      return;
    }

    const payload = await readJson(response);

    if (!response.ok) {
      throw createHttpError(response.status, payload);
    }

    if (options.schema === null) {
      return;
    }

    // Contrat strict : une réponse OK mais mal formée devient une AppError.
    const parsed = options.schema.safeParse(payload);

    if (!parsed.success) {
      throw {
        type: "unknown",
        message: "La réponse du serveur ne respecte pas le contrat attendu.",
        status: response.status,
      } satisfies AppError;
    }

    return parsed.data;
  } catch (error: unknown) {
    if (isAppError(error)) {
      throw error;
    }

    if (controller.signal.aborted) {
      throw {
        type: "network",
        message: timedOut
          ? "Le serveur met trop de temps à répondre."
          : "La requête a été annulée.",
        retryable: timedOut,
      } satisfies AppError;
    }

    throw {
      type: "network",
      message: "Impossible de contacter le serveur.",
      retryable: true,
    } satisfies AppError;
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortFromCaller);
  }
}
