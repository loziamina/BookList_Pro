import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

export function BookCardSkeleton() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={styles.card}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Skeleton height={18} width="70%" />
      <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
      <Skeleton height={12} width="50%" style={{ marginTop: 12 }} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });
}
