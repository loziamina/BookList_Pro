import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { spacing } from "@/theme/tokens";

export function BookDetailSkeleton() {
  return (
    <View
      accessible
      accessibilityLabel="Chargement de la fiche de l'ouvrage"
      accessibilityRole="progressbar"
      style={styles.container}
    >
      <View style={styles.header}>
        <Skeleton height={28} width="70%" />
        <Skeleton height={18} width="45%" />
      </View>

      <View style={styles.card}>
        <Skeleton height={18} width="35%" />
        <Skeleton height={18} width="60%" />
        <Skeleton height={18} width="48%" />
        <Skeleton height={44} width="100%" />
      </View>

      <View style={styles.actions}>
        <Skeleton height={44} width="48%" />
        <Skeleton height={44} width="48%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  header: {
    gap: spacing.sm,
  },
  card: {
    gap: spacing.md,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
