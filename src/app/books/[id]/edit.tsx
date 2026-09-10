import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BookDetailSkeleton } from "@/components/book-details/book-detail-skeleton";
import { BookForm } from "@/components/forms/book-form";
import { isAppError } from "@/domain/app-error";
import { BookFormData } from "@/domain/book";
import { useBook } from "@/hooks/queries/use-book";
import { useUpdateBook } from "@/hooks/queries/use-book-mutations";
import { lightColors, spacing } from "@/theme/tokens";

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const bookId = id ?? "";

  const { data: book, isLoading, isError, error, refetch } = useBook(bookId);
  const updateBook = useUpdateBook();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: BookFormData) => {
      if (!book) {
        return;
      }

      setServerErrors(undefined);
      setSubmitError(null);

      try {
        await updateBook.mutateAsync({
          id: book.id,
          input: data,
          version: book.version,
        });
        router.back();
      } catch (submissionError) {
        if (isAppError(submissionError) && submissionError.type === "validation") {
          setServerErrors(submissionError.fields);
          return;
        }

        setSubmitError(
          isAppError(submissionError)
            ? submissionError.message
            : "Une erreur inattendue est survenue.",
        );
      }
    },
    [book, updateBook, router],
  );

  // État : chargement
  if (isLoading) {
    return <BookDetailSkeleton />;
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
    <View style={styles.container}>
      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      <BookForm
        submitLabel="Enregistrer"
        defaultValues={{
          titre: book.titre,
          auteur: book.auteur,
          editeur: book.editeur,
          annee: book.annee,
          lu: book.lu,
        }}
        onSubmit={handleSubmit}
        serverErrors={serverErrors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});