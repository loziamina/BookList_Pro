import { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

import type { NormalizedBookFilters } from "@/domain/book-filters";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
              active ? `, ordre ${order === "asc" ? "croissant" : "décroissant"}` : ""
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
    chip: {
      minHeight: 44,
      paddingHorizontal: 12,
      justifyContent: "center",
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipActive: { borderColor: colors.primary },
    chipText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
    chipTextActive: { color: colors.primary },
  });
}
