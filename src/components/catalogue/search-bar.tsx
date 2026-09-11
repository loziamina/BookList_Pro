import { useMemo, useState } from "react";
import { TextInput, View, StyleSheet } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

type SearchBarProps = {
  onSearchChange: (query: string) => void;
};

export function SearchBar({ onSearchChange }: SearchBarProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [text, setText] = useState("");

  function handleChange(value: string) {
    setText(value);
    onSearchChange(value);
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={handleChange}
        placeholder="Rechercher par titre ou auteur"
        placeholderTextColor={colors.textMuted}
        accessibilityLabel="Rechercher par titre ou auteur"
        accessibilityRole="search"
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { paddingHorizontal: 16, paddingBottom: 8 },
    input: {
      minHeight: 44,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: 15,
    },
  });
}
