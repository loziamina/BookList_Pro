import { useMemo } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

type BookActionsProps = {
  isRead: boolean;
  onToggleRead: (nextValue: boolean) => void;
  isTogglingRead?: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isTogglingFavorite?: boolean;
};

export function BookActions({
  isRead,
  onToggleRead,
  isTogglingRead,
  isFavorite,
  onToggleFavorite,
  isTogglingFavorite,
}: BookActionsProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.readRow}>
        <Text style={styles.label}>{t.book.alreadyRead}</Text>
        <Switch
          value={isRead}
          onValueChange={onToggleRead}
          disabled={isTogglingRead}
          accessibilityLabel={t.book.readingStatus}
        />
      </View>

      <Pressable
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        disabled={isTogglingFavorite}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? t.book.removeFavorite : t.book.addFavorite
        }
        accessibilityState={{ selected: isFavorite }}
      >
        <Text style={styles.favoriteIcon}>{isFavorite ? "♥" : "♡"}</Text>
        <Text style={styles.favoriteLabel}>
          {isFavorite ? t.book.favorite : t.book.addFavorite}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  readRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
  },
  favoriteIcon: {
    fontSize: 18,
    color: colors.danger,
  },
  favoriteLabel: {
    fontSize: 13,
    color: colors.text,
  },
  });
}