import { Stack } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { AppProviders } from "@/providers/app-providers";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";

function ThemeToggleButton() {
  const { scheme, setMode } = useTheme();

  return (
    <Pressable
      onPress={() => setMode(scheme === "dark" ? "light" : "dark")}
      accessibilityRole="button"
      accessibilityLabel={
        scheme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"
      }
      style={styles.button}
      hitSlop={8}
    >
      <Text style={styles.icon}>{scheme === "dark" ? "☀️" : "🌙"}</Text>
    </Pressable>
  );
}

function Navigation() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerRight: () => <ThemeToggleButton />,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <GlobalErrorBoundary>
      <AppProviders>
        <ThemeProvider>
          <Navigation />
        </ThemeProvider>
      </AppProviders>
    </GlobalErrorBoundary>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 20 },
});
