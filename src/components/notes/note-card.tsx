import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Note } from "@/domain/note";
import { lightColors, radii, spacing } from "@/theme/tokens";

type NoteCardProps = {
  note: Note;
  onDelete: (noteId: string) => void;
  isDeleting?: boolean;
};

export function NoteCard({ note, onDelete, isDeleting }: NoteCardProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatNoteDate(note.createdAt)}</Text>
      <Text style={styles.content}>{note.contenu}</Text>

      {isConfirming ? (
        <View style={styles.confirmRow}>
          <Text style={styles.confirmMessage}>Supprimer cette note ?</Text>
          <Pressable
            style={styles.linkButton}
            onPress={() => setIsConfirming(false)}
            disabled={isDeleting}
            accessibilityRole="button"
          >
            <Text style={styles.linkButtonText}>Annuler</Text>
          </Pressable>
          <Pressable
            style={styles.linkButton}
            onPress={() => onDelete(note.id)}
            disabled={isDeleting}
            accessibilityRole="button"
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? "Suppression…" : "Confirmer"}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.deleteButton}
          onPress={() => setIsConfirming(true)}
          accessibilityRole="button"
          accessibilityLabel="Supprimer la note"
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </Pressable>
      )}
    </View>
  );
}

function formatNoteDate(isoDate: string): string {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surface,
  },
  date: {
    fontSize: 12,
    color: lightColors.textMuted,
  },
  content: {
    fontSize: 14,
    color: lightColors.text,
  },
  deleteButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  deleteButtonText: {
    color: lightColors.danger,
    fontSize: 13,
    fontWeight: "600",
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  confirmMessage: {
    fontSize: 13,
    color: lightColors.text,
  },
  linkButton: {
    paddingVertical: spacing.xs,
  },
  linkButtonText: {
    color: lightColors.text,
    fontSize: 13,
    fontWeight: "600",
  },
});