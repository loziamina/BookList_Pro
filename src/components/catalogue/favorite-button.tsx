import { useMemo } from "react";
import { GestureResponderEvent, Pressable, Text, StyleSheet } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

type FavoriteButtonProps = {
  favori: boolean;
  onToggle: () => void;
};

export function FavoriteButton({ favori, onToggle }: FavoriteButtonProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  function handlePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onToggle();
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: favori }}
      accessibilityLabel={favori ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"}
      style={styles.button}
      hitSlop={8}
    >
      <Text style={[styles.icon, favori && styles.iconActive]}>
        {favori ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    button: {
      minHeight: 44,
      minWidth: 44,
      alignItems: "center",
      justifyContent: "center",
    },
    icon: { fontSize: 20, color: colors.textMuted },
    iconActive: { color: colors.danger },
  });
}
