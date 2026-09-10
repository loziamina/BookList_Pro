import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";

import { BookDetailCard } from "@/components/book-details/book-detail-card";
import { DeleteBookControl } from "@/components/book-details/delete-book-control";
import { isAppError } from "@/domain/app-error";
import { useBookDeletion } from "@/features/books/use-book-deletion";
import { useBook } from "@/hooks/queries/use-book";
import { useToggleReadStatus } from "@/hooks/queries/use-book-mutations";
import { lightColors, spacing } from "@/theme/tokens";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bookId = id ?? "";

  const { data: book, isLoading, isError, error, refetch } = useBook(bookId);
  const toggleReadStatus = useToggleReadStatus();
  const { performDelete, isDeleting } = useBookDeletion(bookId);

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

  // État : vide (l'API a répondu, mais pas d'ouvrage — ne devrait pas
  // arriver avec useBook, gardé par cohérence avec les 4 états requis)
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
      <BookDetailCard
        book={book}
        onToggleRead={handleToggleRead}
        isTogglingRead={toggleReadStatus.isPending}
        onEditPress={handleEditPress}
      />
      <DeleteBookControl onConfirmedDelete={performDelete} isDeleting={isDeleting} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
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
});