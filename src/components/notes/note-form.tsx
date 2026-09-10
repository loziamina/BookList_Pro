import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { NoteFormData, noteFormSchema } from "@/domain/note";
import { lightColors, radii, spacing } from "@/theme/tokens";

const MAX_LENGTH = 1000;

type NoteFormProps = {
  onSubmit: (data: NoteFormData) => Promise<void> | void;
};

export function NoteForm({ onSubmit }: NoteFormProps) {
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

    await onSubmit(data);
    reset({ contenu: "" });
    setCharacterCount(0);
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
            placeholder="Écrire une note de lecture…"
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
          {isSubmitting ? "Envoi en cours…" : "Ajouter la note"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  input: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 14,
    color: lightColors.text,
    backgroundColor: lightColors.surface,
    textAlignVertical: "top",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  counter: {
    fontSize: 12,
    color: lightColors.textMuted,
  },
  errorText: {
    color: lightColors.danger,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: lightColors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: lightColors.primaryContrast,
    fontWeight: "600",
    fontSize: 14,
  },
});