/**
 * Erreurs applicatives.
 * Le client HTTP convertit les codes HTTP en union discriminée sur `type`.
 * L’UI peut alors brancher : toast réseau, champs 422, conflit 409, etc.
 */
export type AppError =
  | {
      type: "network";
      message: string;
      /** true pour timeout / 503 / perte réseau → retry TanStack Query possible */
      retryable: boolean;
      status?: number;
    }
  | {
      type: "validation";
      message: string;
      /** Map champ → message, pour React Hook Form (erreurs 422) */
      fields: Record<string, string>;
      status: 422;
    }
  | {
      type: "conflict";
      message: string;
      serverData: unknown;
      expectedVersion?: number;
      status: 409;
    }
  | {
      type: "auth";
      message: string;
      status: 401 | 403;
    }
  | {
      type: "not-found";
      message: string;
      status: 404;
    }
  | {
      /** Image de couverture trop lourde (413). */
      type: "payload-too-large";
      message: string;
      status: 413;
    }
  | {
      /** Format d’image refusé (415). */
      type: "unsupported-media";
      message: string;
      status: 415;
    }
  | {
      type: "unknown";
      message: string;
      status?: number;
    };

const errorTypes = new Set<AppError["type"]>([
  "network",
  "validation",
  "conflict",
  "auth",
  "not-found",
  "payload-too-large",
  "unsupported-media",
  "unknown",
]);

/** Garde de type : distingue une AppError d’une erreur JS quelconque. */
export function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object" || error === null || !("type" in error)) {
    return false;
  }

  return (
    typeof error.type === "string" &&
    errorTypes.has(error.type as AppError["type"])
  );
}
