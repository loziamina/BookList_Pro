import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { lightColors, radii, spacing } from "@/theme/tokens";

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
  return (
    <View style={styles.container}>
      <View style={styles.readRow}>
        <Text style={styles.label}>Déjà lu</Text>
        <Switch
          value={isRead}
          onValueChange={onToggleRead}
          disabled={isTogglingRead}
          accessibilityLabel="Statut de lecture"
        />
      </View>

      <Pressable
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
        disabled={isTogglingFavorite}
        accessibilityRole="button"
        accessibilityLabel={
          isFavorite ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"
        }
        accessibilityState={{ selected: isFavorite }}
      >
        <Text style={styles.favoriteIcon}>{isFavorite ? "♥" : "♡"}</Text>
        <Text style={styles.favoriteLabel}>
          {isFavorite ? "Coup de cœur" : "Ajouter aux coups de cœur"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: lightColors.border,
  },
  readRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: lightColors.text,
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 44,
  },
  favoriteIcon: {
    fontSize: 18,
    color: lightColors.danger,
  },
  favoriteLabel: {
    fontSize: 13,
    color: lightColors.text,
  },
});