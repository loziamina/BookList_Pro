import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

type StarRatingProps = {
  rating: number | null;
  onRate: (value: number) => void;
  isSaving?: boolean;
};

export function StarRating({ rating, onRate, isSaving }: StarRatingProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const roundedRating = rating !== null ? Math.round(rating) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.starsRow} accessibilityRole="adjustable">
        {STAR_VALUES.map((value) => {
          const isFilled = value <= roundedRating;

          return (
            <Pressable
              key={value}
              onPress={() => onRate(value)}
              disabled={isSaving}
              hitSlop={4}
              accessibilityRole="button"
              accessibilityLabel={t.rating.rateAccessibilityLabel(value)}
              style={styles.starButton}
            >
              <Text style={[styles.star, isFilled && styles.starFilled]}>
                {isFilled ? "★" : "☆"}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.label}>
        {rating !== null ? `${rating} / 5` : t.rating.none}
      </Text>
      {rating !== null && rating > 0 ? (
        <Pressable
          onPress={() => onRate(0)}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel={t.rating.clear}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>{t.rating.clear}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  starsRow: {
    flexDirection: "row",
  },
  starButton: {
    minWidth: 32,
    minHeight: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  star: {
    fontSize: 22,
    color: colors.border,
  },
  starFilled: {
    color: colors.primary,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  clearButton: {
    minHeight: 44,
    justifyContent: "center",
  },
  clearText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  });
}