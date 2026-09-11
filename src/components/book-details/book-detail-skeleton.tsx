import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

export function BookDetailSkeleton() {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      accessible
      accessibilityLabel={t.book.loading}
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.background,
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
}
