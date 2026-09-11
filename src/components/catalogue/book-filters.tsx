import { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

export type StatusFilter = "tous" | "lu" | "nonlu";

type BookFiltersProps = {
  status: StatusFilter;
  favoriOnly: boolean;
  onStatusChange: (status: StatusFilter) => void;
  onFavoriToggle: () => void;
};

export function BookFilters({
  status,
  favoriOnly,
  onStatusChange,
  onFavoriToggle,
}: BookFiltersProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: "tous", label: t.catalogue.filterAll },
    { value: "lu", label: t.catalogue.filterRead },
    { value: "nonlu", label: t.catalogue.filterUnread },
  ];

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {statusOptions.map((option) => {
        const selected = status === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onStatusChange(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={t.catalogue.filterAccessibilityLabel(option.label)}
            style={[styles.chip, selected && styles.chipSelected]}
            hitSlop={4}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}

      <Pressable
        onPress={onFavoriToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: favoriOnly }}
        accessibilityLabel={t.catalogue.filterFavoriAccessibilityLabel}
        style={[styles.chip, favoriOnly && styles.chipSelected]}
        hitSlop={4}
      >
        <Text style={[styles.chipText, favoriOnly && styles.chipTextSelected]}>
          {t.catalogue.filterFavoriOnly}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingBottom: 8 },
    chip: {
      minHeight: 44,
      paddingHorizontal: 14,
      justifyContent: "center",
      borderRadius: 999,
      backgroundColor: colors.surfaceMuted,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipText: { fontSize: 13, fontWeight: "600", color: colors.textMuted },
    chipTextSelected: { color: colors.primaryContrast },
  });
}
