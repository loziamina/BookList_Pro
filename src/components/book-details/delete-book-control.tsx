import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { lightColors, radii, spacing } from "@/theme/tokens";

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
          Supprimer définitivement cet ouvrage ?
        </Text>
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={cancelConfirmation}
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Annuler</Text>
          </Pressable>
          <Pressable
            style={styles.dangerButton}
            onPress={confirmDelete}
            accessibilityRole="button"
          >
            <Text style={styles.dangerButtonText}>Confirmer</Text>
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
            ? "Suppression en cours…"
            : "Ouvrage supprimé dans 5 secondes."}
        </Text>
        <Pressable
          style={styles.secondaryButton}
          onPress={cancelPendingDeletion}
          disabled={isDeleting}
          accessibilityRole="button"
        >
          <Text style={styles.secondaryButtonText}>Annuler</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      style={styles.deleteButton}
      onPress={requestDelete}
      accessibilityRole="button"
      accessibilityLabel="Supprimer l'ouvrage"
    >
      <Text style={styles.deleteButtonText}>Supprimer</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: lightColors.danger,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  deleteButtonText: {
    color: lightColors.danger,
    fontWeight: "600",
    fontSize: 16,
  },
  banner: {
    marginTop: spacing.sm,
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: lightColors.danger,
    backgroundColor: lightColors.surface,
  },
  message: {
    color: lightColors.text,
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: lightColors.text,
    fontWeight: "600",
  },
  dangerButton: {
    flex: 1,
    backgroundColor: lightColors.danger,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  dangerButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});