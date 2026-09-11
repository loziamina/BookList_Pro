import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

export const DELETE_UNDO_DELAY_MS = 5000;

type DeleteBookControlProps = {
  /** Appelé une fois le délai d'annulation écoulé sans que l'utilisateur ait annulé. */
  onConfirmedDelete: () => void;
  /** true pendant que la vraie requête DELETE est en cours côté serveur. */
  isDeleting?: boolean;
};

type Phase = "idle" | "confirming" | "pending-undo";

export function DeleteBookControl({
  onConfirmedDelete,
  isDeleting,
}: DeleteBookControlProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [phase, setPhase] = useState<Phase>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function requestDelete() {
    setPhase("confirming");
  }

  function cancelConfirmation() {
    setPhase("idle");
  }

  function confirmDelete() {
    setPhase("pending-undo");
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onConfirmedDelete();
    }, DELETE_UNDO_DELAY_MS);
  }

  function cancelPendingDeletion() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setPhase("idle");
  }

  if (phase === "confirming") {
    return (
      <View style={styles.banner}>
        <Text style={styles.message}>
          {t.book.deleteQuestion}
        </Text>
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={cancelConfirmation}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>{t.common.cancel}</Text>
          </Pressable>
          <Pressable
            style={styles.dangerButton}
            onPress={confirmDelete}
            accessibilityRole="button"
          >
            <Text style={styles.dangerButtonText}>{t.common.confirm}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (phase === "pending-undo") {
    return (
      <View style={styles.banner}>
        <Text style={styles.message}>
          {isDeleting
            ? t.book.deleting
            : t.book.deletedSoon}
        </Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={cancelPendingDeletion}
          disabled={isDeleting}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>{t.common.cancel}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      style={styles.deleteButton}
      onPress={requestDelete}
      accessibilityRole="button"
      accessibilityLabel={t.book.deleteAccessibilityLabel}
    >
      <Text style={styles.deleteButtonText}>{t.book.delete}</Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  deleteButton: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 16,
  },
  banner: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.danger,
    backgroundColor: colors.surface,
  },
  message: {
    color: colors.text,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: colors.text,
    fontWeight: "600",
  },
  dangerButton: {
    flex: 1,
    backgroundColor: colors.danger,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  });
}