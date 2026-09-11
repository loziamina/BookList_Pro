import { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

import type { NormalizedBookFilters } from "@/domain/book-filters";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

type SortField = NormalizedBookFilters["sort"];
type SortOrder = NormalizedBookFilters["order"];

type BookSortProps = {
  sort: SortField;
  order: SortOrder;
  onChange: (sort: SortField, order: SortOrder) => void;
};

export function BookSort({ sort, order, onChange }: BookSortProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const sortOptions: { value: SortField; label: string }[] = [
    { value: "titre", label: t.catalogue.sortTitle },
    { value: "auteur", label: t.catalogue.sortAuthor },
    { value: "annee", label: t.catalogue.sortYear },
    { value: "note", label: t.catalogue.sortNote },
  ];

  function handlePress(field: SortField) {
    if (field === sort) {
      onChange(field, order === "asc" ? "desc" : "asc");
    } else {
      onChange(field, "asc");
    }
  }

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {sortOptions.map((option) => {
        const active = sort === option.value;
        const arrow = active ? (order === "asc" ? "↑" : "↓") : "";
        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t.catalogue.sortAccessibilityLabel(
              option.label,
              active ? order : undefined,
            )}
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
