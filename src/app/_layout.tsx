import { Stack } from "expo-router";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { AppProviders } from "@/providers/app-providers";

export default function RootLayout() {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        <Stack
          screenOptions={{
            headerShown: true,
          }}
        />
      </AppProviders>
    </GlobalErrorBoundary>
  );
}
