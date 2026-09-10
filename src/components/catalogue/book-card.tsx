import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Book } from "@/domain/book";

type BookCardProps = {
  book: Book;
  onPress: (id: string) => void;
};

function BookCardComponent({ book, onPress }: BookCardProps) {
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
        {book.favori ? (
          <Text accessibilityElementsHidden style={styles.favori}>
            ♥
          </Text>
        ) : null}
      </View>
      <Text style={styles.auteur} numberOfLines={1}>
        {book.auteur}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>
          {book.editeur} · {book.annee}
        </Text>
        <View
          style={[styles.badge, book.lu ? styles.badgeLu : styles.badgeNonLu]}
        >
          <Text style={styles.badgeText}>{statutLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export const BookCard = memo(BookCardComponent);

const styles = StyleSheet.create({
  card: {
    minHeight: 44,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 4,
  },
  cardPressed: { backgroundColor: "#F1F5F9" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  title: { fontSize: 16, fontWeight: "700", flex: 1 },
  favori: { fontSize: 16, color: "#E11D48" },
  auteur: { fontSize: 14, color: "#475569" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  meta: { fontSize: 12, color: "#94A3B8" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  badgeLu: { backgroundColor: "#DCFCE7" },
  badgeNonLu: { backgroundColor: "#FEF3C7" },
  badgeText: { fontSize: 12, fontWeight: "600" },
});
