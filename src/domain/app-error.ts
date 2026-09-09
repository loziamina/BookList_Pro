export type AppError =
  | {
      type: "network";
      message: string;
      retryable: boolean;
      status?: number;
    }
  | {
      type: "validation";
      message: string;
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
  "unknown",
]);

export function isAppError(error: unknown): error is AppError {
  if (typeof error !== "object" || error === null || !("type" in error)) {
    return false;
  }

  return (
    typeof error.type === "string" &&
    errorTypes.has(error.type as AppError["type"])
  );
}
