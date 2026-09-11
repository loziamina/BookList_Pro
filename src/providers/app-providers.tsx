/**
 * Providers globaux.
 * Configure TanStack Query : retry réseau uniquement, staleTime 30s, pas de retry mutations.
 */
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { PropsWithChildren } from "react";

import { isAppError } from "@/domain/app-error";
import { I18nProvider } from "@/providers/i18n-provider";

/** Retry seulement si AppError réseau marquée retryable (timeout, 503…). */
function shouldRetry(failureCount: number, error: unknown): boolean {
  return (
    failureCount < 2 &&
    isAppError(error) &&
    error.type === "network" &&
    error.retryable
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 5_000),
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{children}</I18nProvider>
    </QueryClientProvider>
  );
}
