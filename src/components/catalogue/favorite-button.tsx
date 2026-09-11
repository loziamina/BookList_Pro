import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type FavoriteButtonProps = {
  favori: boolean;
  onToggle: () => void;
};

export function FavoriteButton({ favori, onToggle }: FavoriteButtonProps) {
  function handlePress(event: GestureResponderEvent) {
    event.stopPropagation();
    onToggle();
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: favori }}
      accessibilityLabel={
        favori ? "Retirer des coups de cœur" : "Ajouter aux coups de cœur"
      }
      style={styles.button}
      hitSlop={8}
    >
      <Text style={[styles.icon, favori && styles.iconActive]}>
        {favori ? "♥" : "♡"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 20, color: "#94A3B8" },
  iconActive: { color: "#E11D48" },
});
