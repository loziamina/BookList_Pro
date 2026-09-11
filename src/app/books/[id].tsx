import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookActions } from "@/components/book-details/book-actions";
import { BookCover } from "@/components/book-details/book-cover";
import { BookDetailCard } from "@/components/book-details/book-detail-card";
import { CoverUpload } from "@/components/book-details/cover-upload";
import { DeleteBookControl } from "@/components/book-details/delete-book-control";
import { OpenLibraryInfo } from "@/components/book-details/open-library-info";
import { StarRating } from "@/components/book-details/star-rating";
import { NoteForm } from "@/components/notes/note-form";
import { NoteList } from "@/components/notes/note-list";
import { isAppError } from "@/domain/app-error";
import { useBookDeletion } from "@/features/books/use-book-deletion";
import { useBookCoverPanel } from "@/features/covers/use-book-cover-panel";
import { useNotesPanel } from "@/features/notes/use-notes-panel";
import { useBook } from "@/hooks/queries/use-book";
import { useToggleFavorite } from "@/hooks/queries/use-book-actions";
import {
  usePatchBook,
  useToggleReadStatus,
} from "@/hooks/queries/use-book-mutations";
import { useOpenLibraryEditions } from "@/hooks/queries/use-open-library";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const bookId = id ?? "";

  const { data: book, isLoading, isError, error, refetch } = useBook(bookId);
  const toggleReadStatus = useToggleReadStatus();
  const toggleFavorite = useToggleFavorite();
  const patchBook = usePatchBook();
  const { performDelete, isDeleting } = useBookDeletion(bookId);
  const {
    notes,
    addNote,
    addNoteError,
    removeNote,
    deleteNoteError,
    deletingNoteId,
  } = useNotesPanel(bookId);
  const {
    uploadImage,
    isUploading,
    uploadError,
    removeCover,
    isRemoving,
    removeError,
  } = useBookCoverPanel(bookId, book?.version);
  const openLibraryQuery = useOpenLibraryEditions(book?.titre ?? "");

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

  const handleRate = useCallback(
    (value: number) => {
      if (!book) {
        return;
      }

      patchBook.mutate({
        id: book.id,
        input: { note: value },
        version: book.version,
      });
    },
    [book, patchBook],
  );

  // État : chargement
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.centeredText}>{t.book.loading}</Text>
      </View>
    );
  }

  // État : erreur, avec réessai
  if (isError) {
    const message = isAppError(error)
      ? error.message
      : t.common.unexpectedError;

    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{message}</Text>
        <Text style={styles.retryLink} onPress={() => refetch()}>
          {t.common.retry}
        </Text>
      </View>
    );
  }

  // État : vide
  if (!book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.centeredText}>{t.common.bookNotFound}</Text>
      </View>
    );
  }

  // État : succès
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BookCover couverture={book.couverture} size={140} />
      <CoverUpload
        hasCover={book.couverture !== null}
        onUpload={uploadImage}
        onRemove={removeCover}
        isUploading={isUploading}
        isRemoving={isRemoving}
        uploadError={uploadError ?? removeError}
      />

      <BookDetailCard book={book} onEditPress={handleEditPress} />

      <StarRating
        rating={book.note}
        onRate={handleRate}
        isSaving={patchBook.isPending}
      />

      <OpenLibraryInfo
        isLoading={openLibraryQuery.isLoading}
        available={openLibraryQuery.data?.available ?? false}
        editionCount={openLibraryQuery.data?.editionCount ?? 0}
      />

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
        <Text style={styles.sectionTitle}>{t.book.notesTitle}</Text>
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    gap: spacing.md,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  centeredText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  retryLink: {
    color: colors.primary,
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
    color: colors.text,
  },
  });
}