import { Pressable, StyleSheet, Text, View } from "react-native";

type StateMessageProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateMessage({
  title,
  description,
  actionLabel,
  onAction,
}: StateMessageProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
          style={styles.button}
          hitSlop={8}
        >
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  description: { fontSize: 14, color: "#64748B", textAlign: "center" },
  button: {
    marginTop: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    minWidth: 44,
    backgroundColor: "#2563EB",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#FFFFFF", fontWeight: "600" },
});
