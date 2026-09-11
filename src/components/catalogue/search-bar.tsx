import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  onSearchChange: (query: string) => void;
};

export function SearchBar({ onSearchChange }: SearchBarProps) {
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
        accessibilityLabel="Rechercher par titre ou auteur"
        accessibilityRole="search"
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingBottom: 8 },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    fontSize: 15,
  },
});
