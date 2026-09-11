import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Book } from "@/domain/book";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

type BookDetailCardProps = {
  book: Book;
  onEditPress: () => void;
};

export function BookDetailCard({ book, onEditPress }: BookDetailCardProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.titre}</Text>
      <Text style={styles.subtitle}>{book.auteur}</Text>

      <View style={styles.metaRow}>
        <MetaField label={t.book.publisher} value={book.editeur} styles={styles} />
        <MetaField label={t.book.year} value={String(book.annee)} styles={styles} />
      </View>

      <Pressable
        style={styles.editButton}
        onPress={onEditPress}
        accessibilityRole="button"
        accessibilityLabel={t.book.editAccessibilityLabel}
      >
        <Text style={styles.editButtonText}>{t.book.edit}</Text>
      </Pressable>
    </View>
  );
}

function MetaField({
  label,
  value,
  styles,
}: {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}) {
  return (
    <View style={styles.metaField}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  metaRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  metaField: {
    gap: spacing.xs,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 16,
    color: colors.text,
  },
  editButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  editButtonText: {
    color: colors.primaryContrast,
    fontWeight: "600",
    fontSize: 16,
  },
  });
}