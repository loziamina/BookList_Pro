import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { BookCard } from "@/components/catalogue/book-card";
import { BookCardSkeleton } from "@/components/catalogue/book-card-skeleton";
import { StateMessage } from "@/components/ui/state-message";
import type { Book } from "@/domain/book";
import { useBooks } from "@/features/catalogue/use-books.temp";

const PAGE_SIZE = 20;

export default function CatalogueScreen() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, refetch, isFetching } = useBooks({
    page,
    limit: PAGE_SIZE,
    sort: "titre",
    order: "asc",
  });

  function handleOpenBook(id: string) {
    router.push(`/books/${id}` as never);
  }

  function handleAddBook() {
    router.push("/books/new" as never);
  }

  if (isPending) {
    return (
      <FlatList
        data={Array.from({ length: 6 })}
        keyExtractor={(_, index) => `skeleton-${index}`}
        renderItem={() => <BookCardSkeleton />}
        contentContainerStyle={styles.list}
        accessibilityLabel="Chargement du catalogue"
      />
    );
  }

  if (isError) {
    return (
      <StateMessage
        title="Impossible de charger le catalogue"
        description={error.message}
        actionLabel="Réessayer"
        onAction={() => refetch()}
      />
    );
  }

  const books = data.items;

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {data.total} ouvrage{data.total > 1 ? "s" : ""}
        </Text>
        <Pressable
          onPress={handleAddBook}
          accessibilityRole="button"
          accessibilityLabel="Ajouter un ouvrage"
          style={styles.addButton}
          hitSlop={8}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </Pressable>
      </View>

      {books.length === 0 ? (
        <StateMessage
          title="Aucun ouvrage"
          description="Le fonds ne contient aucun ouvrage pour ces critères."
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(book: Book) => book.id}
          renderItem={({ item }) => (
            <BookCard book={item} onPress={handleOpenBook} />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      <View style={styles.pagination}>
        <Pressable
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          accessibilityRole="button"
          accessibilityLabel="Page précédente"
          style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
          hitSlop={8}
        >
          <Text style={styles.pageButtonText}>Précédent</Text>
        </Pressable>
        <Text style={styles.pageLabel}>
          Page {data.page} / {data.totalPages}
          {isFetching ? " · actualisation…" : ""}
        </Text>
        <Pressable
          onPress={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={page >= data.totalPages}
          accessibilityRole="button"
          accessibilityLabel="Page suivante"
          style={[
            styles.pageButton,
            page >= data.totalPages && styles.pageButtonDisabled,
          ]}
          hitSlop={8}
        >
          <Text style={styles.pageButtonText}>Suivant</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  count: { fontSize: 14, color: "#475569" },
  addButton: {
    minHeight: 44,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
  },
  addButtonText: { color: "#FFFFFF", fontWeight: "600" },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  separator: { height: 12 },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  pageButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  pageButtonDisabled: { opacity: 0.4 },
  pageButtonText: { fontWeight: "600", color: "#1E293B" },
  pageLabel: { fontSize: 13, color: "#64748B" },
});
