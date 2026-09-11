import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { NoteFormData, noteFormSchema } from "@/domain/note";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

const MAX_LENGTH = 1000;

type NoteFormProps = {
  onSubmit: (data: NoteFormData) => Promise<void> | void;
};

export function NoteForm({ onSubmit }: NoteFormProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [characterCount, setCharacterCount] = useState(0);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: { contenu: "" },
  });

  const submitForm = handleSubmit(async (data) => {
    if (isSubmitting) {
      return;
    }

    try {
      await onSubmit(data);
      reset({ contenu: "" });
      setCharacterCount(0);
    } catch {
      // L'erreur est affichée par l'appelant ; on garde la saisie
      // pour que rien ne soit perdu.
    }
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="contenu"
        render={({ field }) => (
          <TextInput
            style={styles.input}
            value={field.value}
            onChangeText={(text) => {
              const truncated = text.slice(0, MAX_LENGTH);
              field.onChange(truncated);
              setCharacterCount(truncated.length);
            }}
            onBlur={field.onBlur}
            placeholder={t.notes.placeholder}
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={MAX_LENGTH}
            editable={!isSubmitting}
          />
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.counter}>
          {characterCount} / {MAX_LENGTH}
        </Text>
        {errors.contenu ? (
          <Text style={styles.errorText}>{errors.contenu.message}</Text>
        ) : null}
      </View>

      <Pressable
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={submitForm}
        disabled={isSubmitting}
        accessibilityRole="button"
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? t.common.submitting : t.notes.add}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  counter: {
    fontSize: 12,
    color: colors.textMuted,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.primaryContrast,
    fontWeight: "600",
    fontSize: 14,
  },
  });
}