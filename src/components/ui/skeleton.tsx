import { useMemo } from "react";
import { View, StyleSheet } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

type SkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
  style?: object;
};

export function Skeleton({ height = 16, width = "100%", style }: SkeletonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.skeleton, { height, width }, style]}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    skeleton: {
      backgroundColor: colors.surfaceMuted,
      borderRadius: 6,
    },
  });
}
