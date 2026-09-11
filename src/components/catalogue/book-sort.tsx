import { Pressable, StyleSheet, Text, View } from "react-native";

import type { NormalizedBookFilters } from "@/domain/book-filters";

type SortField = NormalizedBookFilters["sort"];
type SortOrder = NormalizedBookFilters["order"];

type BookSortProps = {
  sort: SortField;
  order: SortOrder;
  onChange: (sort: SortField, order: SortOrder) => void;
};

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "titre", label: "Titre" },
  { value: "auteur", label: "Auteur" },
  { value: "annee", label: "Année" },
  { value: "note", label: "Note" },
];

export function BookSort({ sort, order, onChange }: BookSortProps) {
  function handlePress(field: SortField) {
    if (field === sort) {
      onChange(field, order === "asc" ? "desc" : "asc");
    } else {
      onChange(field, "asc");
    }
  }

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {SORT_OPTIONS.map((option) => {
        const active = sort === option.value;
        const arrow = active ? (order === "asc" ? "↑" : "↓") : "";
        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Trier par ${option.label}${
              active
                ? `, ordre ${order === "asc" ? "croissant" : "décroissant"}`
                : ""
            }`}
            style={[styles.chip, active && styles.chipActive]}
            hitSlop={4}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>
              {option.label} {arrow}
            </Text>
          </Pressable>
        );
      })}
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
    paddingHorizontal: 12,
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipActive: { borderColor: "#2563EB" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#475569" },
  chipTextActive: { color: "#2563EB" },
});
