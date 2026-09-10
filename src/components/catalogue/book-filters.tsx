import { Pressable, StyleSheet, Text, View } from "react-native";

export type StatusFilter = "tous" | "lu" | "nonlu";

type BookFiltersProps = {
  status: StatusFilter;
  favoriOnly: boolean;
  onStatusChange: (status: StatusFilter) => void;
  onFavoriToggle: () => void;
};

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "lu", label: "Lu" },
  { value: "nonlu", label: "Non lu" },
];

export function BookFilters({
  status,
  favoriOnly,
  onStatusChange,
  onFavoriToggle,
}: BookFiltersProps) {
  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {STATUS_OPTIONS.map((option) => {
        const selected = status === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onStatusChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={`Filtrer : ${option.label}`}
            style={[styles.chip, selected && styles.chipSelected]}
            hitSlop={4}
          >
            <Text
              style={[styles.chipText, selected && styles.chipTextSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={onFavoriToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: favoriOnly }}
        accessibilityLabel="Coups de cœur uniquement"
        style={[styles.chip, favoriOnly && styles.chipSelected]}
        hitSlop={4}
      >
        <Text style={[styles.chipText, favoriOnly && styles.chipTextSelected]}>
          Favoris
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  chip: {
    minHeight: 44,
    paddingHorizontal: 14,
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipSelected: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  chipTextSelected: { color: "#FFFFFF" },
});
