import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookActions } from "@/components/book-details/book-actions";
import { BookDetailCard } from "@/components/book-details/book-detail-card";
import { DeleteBookControl } from "@/components/book-details/delete-book-control";
import { NoteForm } from "@/components/notes/note-form";
import { NoteList } from "@/components/notes/note-list";
import { isAppError } from "@/domain/app-error";
import { useBookDeletion } from "@/features/books/use-book-deletion";
import { useNotesPanel } from "@/features/notes/use-notes-panel";
import { useBook } from "@/hooks/queries/use-book";
import { useToggleFavorite } from "@/hooks/queries/use-book-actions";
import { useToggleReadStatus } from "@/hooks/queries/use-book-mutations";
import { lightColors, spacing } from "@/theme/tokens";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bookId = id ?? "";

  const { data: book, isLoading, isError, error, refetch } = useBook(bookId);
  const toggleReadStatus = useToggleReadStatus();
  const toggleFavorite = useToggleFavorite();
  const { performDelete, isDeleting } = useBookDeletion(bookId);
  const {
    notes,
    addNote,
    addNoteError,
    removeNote,
    deleteNoteError,
    deletingNoteId,
  } = useNotesPanel(bookId);

  const handleToggleRead = useCallback(
    (nextValue: boolean) => {
      if (!book) {
        return;
      }

      toggleReadStatus.mutate({
        id: book.id,
        lu: nextValue,
        version: book.version,
      });
    },
    [book, toggleReadStatus],
  );

  const handleToggleFavorite = useCallback(() => {
    if (!book) {
      return;
    }

    toggleFavorite.mutate({
      id: book.id,
      favori: !book.favori,
      version: book.version,
    });
  }, [book, toggleFavorite]);

  const handleEditPress = useCallback(() => {
    router.push(`/books/${bookId}/edit`);
  }, [router, bookId]);

  // État : chargement
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={lightColors.primary} />
        <Text style={styles.centeredText}>Chargement de la fiche…</Text>
      </View>
    );
  }

  // État : erreur, avec réessai
  if (isError) {
    const message = isAppError(error)
      ? error.message
      : "Une erreur inattendue est survenue.";

    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{message}</Text>
        <Text style={styles.retryLink} onPress={() => refetch()}>
          Réessayer
        </Text>
      </View>
    );
  }

  // État : vide
  if (!book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>Cet ouvrage est introuvable.</Text>
      </View>
    );
  }

  // État : succès
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BookDetailCard book={book} onEditPress={handleEditPress} />

      <BookActions
        isRead={book.lu}
        onToggleRead={handleToggleRead}
        isTogglingRead={toggleReadStatus.isPending}
        isFavorite={book.favori}
        onToggleFavorite={handleToggleFavorite}
        isTogglingFavorite={toggleFavorite.isPending}
      />

      <DeleteBookControl onConfirmedDelete={performDelete} isDeleting={isDeleting} />

      <View style={styles.notesSection}>
        <Text style={styles.sectionTitle}>Notes de lecture</Text>
        {addNoteError ? <Text style={styles.errorText}>{addNoteError}</Text> : null}
        {deleteNoteError ? (
          <Text style={styles.errorText}>{deleteNoteError}</Text>
        ) : null}
        <NoteForm onSubmit={addNote} />
        <NoteList
          notes={notes}
          onDeleteNote={removeNote}
          deletingNoteId={deletingNoteId}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  centeredText: {
    color: lightColors.textMuted,
    fontSize: 14,
  },
  errorText: {
    color: lightColors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  retryLink: {
    color: lightColors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  notesSection: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: lightColors.text,
  },
});