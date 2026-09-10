import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BookForm } from "@/components/forms/book-form";
import { isAppError } from "@/domain/app-error";
import { BookFormData } from "@/domain/book";
import { useCreateBook } from "@/hooks/queries/use-book-mutations";
import { lightColors, spacing } from "@/theme/tokens";

export default function NewBookScreen() {
  const router = useRouter();
  const createBook = useCreateBook();

  const [serverErrors, setServerErrors] = useState<Record<string, string>>();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (data: BookFormData) => {
      setServerErrors(undefined);
      setSubmitError(null);

      try {
        const book = await createBook.mutateAsync(data);
        router.replace(`/books/${book.id}`);
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
    [createBook, router],
  );

  return (
    <View style={styles.container}>
      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      <BookForm
        submitLabel="Ajouter"
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
  errorText: {
    color: lightColors.danger,
    fontSize: 14,
    textAlign: "center",
  },
});