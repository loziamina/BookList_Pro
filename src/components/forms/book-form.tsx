import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
import { lightColors, radii, spacing } from "@/theme/tokens";

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
      <Field label="Titre" error={errors.titre?.message}>
        <Controller
          control={control}
          name="titre"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Titre de l'ouvrage"
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label="Auteur" error={errors.auteur?.message}>
        <Controller
          control={control}
          name="auteur"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Auteur"
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label="Éditeur" error={errors.editeur?.message}>
        <Controller
          control={control}
          name="editeur"
          render={({ field }) => (
            <TextInput
              style={styles.input}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              placeholder="Éditeur"
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <Field label="Année" error={errors.annee?.message}>
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
              placeholder="Année de publication"
              keyboardType="number-pad"
              editable={!isSubmitting}
            />
          )}
        />
      </Field>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Déjà lu</Text>
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
          {isSubmitting ? "Envoi en cours…" : submitLabel}
        </Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: lightColors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: lightColors.text,
    backgroundColor: lightColors.surface,
  },
  errorText: {
    color: lightColors.danger,
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
    backgroundColor: lightColors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: lightColors.primaryContrast,
    fontWeight: "600",
    fontSize: 16,
  },
});