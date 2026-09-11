import { useMemo } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";

import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

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
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 8 },
    title: { fontSize: 16, fontWeight: "600", textAlign: "center", color: colors.text },
    description: { fontSize: 14, color: colors.textMuted, textAlign: "center" },
    button: {
      marginTop: 12,
      paddingHorizontal: 16,
      minHeight: 44,
      minWidth: 44,
      backgroundColor: colors.primary,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: { color: colors.primaryContrast, fontWeight: "600" },
  });
}
