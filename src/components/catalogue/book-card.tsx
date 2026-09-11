import { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FavoriteButton } from "@/components/catalogue/favorite-button";
import type { Book } from "@/domain/book";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

type BookCardProps = {
  book: Book;
  onPress: (id: string) => void;
  onToggleFavorite: (book: Book) => void;
};

function BookCardComponent({ book, onPress, onToggleFavorite }: BookCardProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const statutLabel = book.lu ? "Lu" : "Non lu";

  return (
    <Pressable
      onPress={() => onPress(book.id)}
      accessibilityRole="button"
      accessibilityLabel={`${book.titre}, de ${book.auteur}, ${statutLabel}${
        book.favori ? ", coup de cœur" : ""
      }`}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      hitSlop={4}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {book.titre}
        </Text>
        <FavoriteButton
          favori={book.favori}
          onToggle={() => onToggleFavorite(book)}
        />
      </View>
      <Text style={styles.auteur} numberOfLines={1}>
        {book.auteur}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>
          {book.editeur} · {book.annee}
        </Text>
        <View style={[styles.badge, book.lu ? styles.badgeLu : styles.badgeNonLu]}>
          <Text style={styles.badgeText}>{statutLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const BookCard = memo(BookCardComponent);

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      minHeight: 44,
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
    cardPressed: { backgroundColor: colors.surfaceMuted },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
    title: { fontSize: 16, fontWeight: "700", flex: 1, color: colors.text },
    auteur: { fontSize: 14, color: colors.textMuted },
    footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
    meta: { fontSize: 12, color: colors.textMuted },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
    badgeLu: { backgroundColor: colors.successMuted },
    badgeNonLu: { backgroundColor: colors.warningMuted },
    badgeText: { fontSize: 12, fontWeight: "600", color: colors.text },
  });
}
