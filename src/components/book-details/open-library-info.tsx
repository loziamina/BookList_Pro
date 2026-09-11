import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

type OpenLibraryInfoProps = {
  isLoading: boolean;
  available: boolean;
  editionCount: number;
};

export function OpenLibraryInfo({
  isLoading,
  available,
  editionCount,
}: OpenLibraryInfoProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  // Indisponibilité (timeout, erreur réseau, réponse invalide) : dégradation
  // silencieuse, on n'affiche jamais d'erreur pour un service externe optionnel.
  if (!available) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t.openLibrary.loading}</Text>
      </View>
    );
  }

  // « Zéro édition trouvée » est un résultat normal, pas une erreur : une
  // partie du fonds a été saisie sans correspondre à un ouvrage référencé.
  if (editionCount === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t.openLibrary.none}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t.openLibrary.editions(editionCount)}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 12,
    color: colors.textMuted,
    fontStyle: "italic",
  },
  });
}