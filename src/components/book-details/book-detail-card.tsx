import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Book } from "@/domain/book";
import { lightColors, radii, spacing } from "@/theme/tokens";

type BookDetailCardProps = {
  book: Book;
  onToggleRead: (nextValue: boolean) => void;
  isTogglingRead?: boolean;
  onEditPress: () => void;
};

export function BookDetailCard({
  book,
  onToggleRead,
  isTogglingRead,
  onEditPress,
}: BookDetailCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.titre}</Text>
      <Text style={styles.subtitle}>{book.auteur}</Text>

      <View style={styles.metaRow}>
        <MetaField label="Éditeur" value={book.editeur} />
        <MetaField label="Année" value={String(book.annee)} />
      </View>

      <View style={styles.statusRow}>
        <Text style={styles.label}>Déjà lu</Text>
        <Switch
          value={book.lu}
          onValueChange={onToggleRead}
          disabled={isTogglingRead}
          accessibilityLabel="Statut de lecture"
        />
      </View>

      <Pressable
        style={styles.editButton}
        onPress={onEditPress}
        accessibilityRole="button"
        accessibilityLabel="Modifier l'ouvrage"
      >
        <Text style={styles.editButtonText}>Modifier</Text>
      </Pressable>
    </View>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaField}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: lightColors.text,
  },
  subtitle: {
    fontSize: 16,
    color: lightColors.textMuted,
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
    color: lightColors.textMuted,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 16,
    color: lightColors.text,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: lightColors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: lightColors.text,
  },
  editButton: {
    marginTop: spacing.sm,
    backgroundColor: lightColors.primary,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  editButtonText: {
    color: lightColors.primaryContrast,
    fontWeight: "600",
    fontSize: 16,
  },
});