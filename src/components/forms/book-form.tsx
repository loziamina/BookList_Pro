import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
    Pressable,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import { BookFormData, bookFormSchema } from "@/domain/book";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

type BookFormProps = {
  defaultValues?: Partial<BookFormData>;
  onSubmit: (data: BookFormData) => Promise<void> | void;
  submitLabel: string;
  /** Erreurs 422 renvoyées par l'API, indexées par nom de champ. */
  serverErrors?: Record<string, string>;
};

const emptyDefaults: BookFormData = {
  titre: "",
  auteur: "",
  editeur: "",
  annee: new Date().getFullYear(),
  lu: false,
};

export function BookForm({
  defaultValues,
  onSubmit,
  submitLabel,
  serverErrors,
}: BookFormProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: { ...emptyDefaults, ...defaultValues },
  });

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (!serverErrors) {
      return;
    }

    for (const [field, message] of Object.entries(serverErrors)) {
      setError(field as keyof BookFormData, { type: "server", message });
    }
  }, [serverErrors, setError]);

  const submitForm = handleSubmit(async (data) => {
  if (isSubmitting) {
    return;
  }

  await onSubmit(data);
});

  return (
    <View style={styles.container}>
      <Field label={t.book.fields.title} error={errors.titre?.message} styles={styles}>
        <Controller
          control={control}
          name="titre"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder={t.book.fields.titlePlaceholder}
              placeholderTextColor={colors.textMuted}
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label={t.book.fields.author} error={errors.auteur?.message} styles={styles}>
        <Controller
          control={control}
          name="auteur"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder={t.book.fields.authorPlaceholder}
              placeholderTextColor={colors.textMuted}
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label={t.book.fields.publisher} error={errors.editeur?.message} styles={styles}>
        <Controller
          control={control}
          name="editeur"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder={t.book.fields.publisherPlaceholder}
              placeholderTextColor={colors.textMuted}
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label={t.book.fields.year} error={errors.annee?.message} styles={styles}>
        <Controller
          control={control}
          name="annee"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value ? String(field.value) : ""}
              onChangeText={(text) => {
                const digitsOnly = text.replace(/[^0-9]/g, "");
                field.onChange(digitsOnly === "" ? undefined : Number(digitsOnly));
              }}
              onBlur={field.onBlur}
              placeholder={t.book.fields.yearPlaceholder}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <View style={styles.switchRow}>
        <Text style={styles.label}>{t.book.alreadyRead}</Text>
        <Controller
          control={control}
          name="lu"
          render={({ field }) => (
            <Switch
              value={field.value}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </View>

      <Pressable
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={submitForm}
        disabled={isSubmitting}
        accessibilityRole="button"
        accessibilityState={{ disabled: isSubmitting }}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? t.common.submitting : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  error,
  children,
  styles,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.primaryContrast,
    fontWeight: "600",
    fontSize: 16,
  },
  });
}