import { Stack } from "expo-router";
import { Pressable, Text, StyleSheet, View } from "react-native";

import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { AppProviders } from "@/providers/app-providers";
import { useI18n } from "@/providers/i18n-provider";
import { ThemeProvider, useTheme } from "@/providers/theme-provider";

function ThemeToggleButton() {
  const { scheme, setMode } = useTheme();
  const { t } = useI18n();

  return (
    <Pressable
      onPress={() => setMode(scheme === "dark" ? "light" : "dark")}
      accessibilityRole="button"
      accessibilityLabel={
        scheme === "dark" ? t.theme.toLight : t.theme.toDark
      }
      style={styles.button}
      hitSlop={8}
    >
      <Text style={styles.icon}>{scheme === "dark" ? "☀️" : "🌙"}</Text>
    </Pressable>
  );
}

function LanguageToggleButton() {
  const { locale, setLocale, t } = useI18n();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => setLocale(locale === "fr" ? "en" : "fr")}
      accessibilityRole="button"
      accessibilityLabel={t.language.switchTo}
      style={styles.button}
      hitSlop={8}
    >
      <Text style={[styles.languageLabel, { color: colors.text }]}>
        {t.language.short}
      </Text>
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
        headerRight: () => (
          <View style={styles.headerActions}>
            <LanguageToggleButton />
            <ThemeToggleButton />
          </View>
        ),
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <ThemeProvider>
        <GlobalErrorBoundary>
          <Navigation />
        </GlobalErrorBoundary>
      </ThemeProvider>
    </AppProviders>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 44, minWidth: 44, alignItems: "center", justifyContent: "center" },
  icon: { fontSize: 20 },
  languageLabel: { fontSize: 13, fontWeight: "700" },
  headerActions: { flexDirection: "row", alignItems: "center" },
});
