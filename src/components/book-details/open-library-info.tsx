import { StyleSheet, Text, View } from "react-native";

import { lightColors, spacing } from "@/theme/tokens";

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
  // Indisponibilité (timeout, erreur réseau, réponse invalide) : dégradation
  // silencieuse, on n'affiche jamais d'erreur pour un service externe optionnel.
  if (!available) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Recherche sur OpenLibrary…</Text>
      </View>
    );
  }

  // « Zéro édition trouvée » est un résultat normal, pas une erreur : une
  // partie du fonds a été saisie sans correspondre à un ouvrage référencé.
  if (editionCount === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Aucune édition référencée sur OpenLibrary.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {editionCount} édition{editionCount > 1 ? "s" : ""} référencée
        {editionCount > 1 ? "s" : ""} sur OpenLibrary
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  text: {
    fontSize: 12,
    color: lightColors.textMuted,
    fontStyle: "italic",
  },
});