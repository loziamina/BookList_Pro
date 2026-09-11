import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { BookForm } from "@/components/forms/book-form";
import { isAppError } from "@/domain/app-error";
import { BookFormData } from "@/domain/book";
import { useCreateBook } from "@/hooks/queries/use-book-mutations";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { spacing, type ThemeColors } from "@/theme/tokens";

export default function NewBookScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
            : t.common.unexpectedError,
        );
      }
    },
    [createBook, router, t.common.unexpectedError],
  );

  return (
    <View style={styles.container}>
      {submitError ? <Text style={styles.errorText}>{submitError}</Text> : null}
      <BookForm
        submitLabel={t.book.add}
        onSubmit={handleSubmit}
        serverErrors={serverErrors}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: "center",
  },
  });
}