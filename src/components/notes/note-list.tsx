import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NoteCard } from "@/components/notes/note-card";
import { Note } from "@/domain/note";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

type NoteListProps = {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  deletingNoteId?: string | null;
};

export function NoteList({ notes, onDeleteNote, deletingNoteId }: NoteListProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {t.notes.empty}
        </Text>
      </View>
    );
  }

  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <View style={styles.list}>
      {sortedNotes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDeleteNote}
          isDeleting={deletingNoteId === note.id}
        />
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
  });
}