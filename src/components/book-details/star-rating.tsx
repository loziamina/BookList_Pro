import { Pressable, StyleSheet, Text, View } from "react-native";

import { lightColors, spacing } from "@/theme/tokens";

const STAR_VALUES = [1, 2, 3, 4, 5] as const;

type StarRatingProps = {
  rating: number | null;
  onRate: (value: number) => void;
  isSaving?: boolean;
};

export function StarRating({ rating, onRate, isSaving }: StarRatingProps) {
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
              accessibilityLabel={`Noter ${value} étoile${value > 1 ? "s" : ""} sur 5`}
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
        {rating !== null ? `${rating} / 5` : "Pas encore noté"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: lightColors.border,
  },
  starFilled: {
    color: lightColors.primary,
  },
  label: {
    fontSize: 13,
    color: lightColors.textMuted,
  },
});