import { StyleSheet, Text, View } from "react-native";

import { NoteCard } from "@/components/notes/note-card";
import { Note } from "@/domain/note";
import { lightColors, spacing } from "@/theme/tokens";

type NoteListProps = {
  notes: Note[];
  onDeleteNote: (noteId: string) => void;
  deletingNoteId?: string | null;
};

export function NoteList({ notes, onDeleteNote, deletingNoteId }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {"Aucune note de lecture pour cet ouvrage pour l'instant."}
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

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: lightColors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});