import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Note } from "@/domain/note";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

type NoteCardProps = {
  note: Note;
  onDelete: (noteId: string) => void;
  isDeleting?: boolean;
};

export function NoteCard({ note, onDelete, isDeleting }: NoteCardProps) {
  const { t, formatDate } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
      <Text style={styles.content}>{note.contenu}</Text>

      {isConfirming ? (
        <View style={styles.confirmRow}>
          <Text style={styles.confirmMessage}>{t.notes.deleteQuestion}</Text>
          <Pressable
            style={styles.linkButton}
            onPress={() => setIsConfirming(false)}
            disabled={isDeleting}
            accessibilityRole="button"
          >
            <Text style={styles.linkButtonText}>{t.common.cancel}</Text>
          </Pressable>
          <Pressable
            style={styles.linkButton}
            onPress={() => onDelete(note.id)}
            disabled={isDeleting}
            accessibilityRole="button"
          >
            <Text style={styles.deleteButtonText}>
              {isDeleting ? t.notes.deleting : t.common.confirm}
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={styles.deleteButton}
          onPress={() => setIsConfirming(true)}
          accessibilityRole="button"
          accessibilityLabel={t.notes.deleteAccessibilityLabel}
        >
          <Text style={styles.deleteButtonText}>{t.notes.delete}</Text>
        </Pressable>
      )}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  content: {
    fontSize: 14,
    color: colors.text,
  },
  deleteButton: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
  },
  deleteButtonText: {
    color: colors.danger,
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
    color: colors.text,
  },
  linkButton: {
    paddingVertical: spacing.xs,
  },
  linkButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  });
}