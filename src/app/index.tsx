import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { BookCard } from "@/components/catalogue/book-card";
import { BookCardSkeleton } from "@/components/catalogue/book-card-skeleton";
import { BookFilters, type StatusFilter } from "@/components/catalogue/book-filters";
import { BookSort } from "@/components/catalogue/book-sort";
import { SearchBar } from "@/components/catalogue/search-bar";
import { StateMessage } from "@/components/ui/state-message";
import type { Book } from "@/domain/book";
import type { NormalizedBookFilters } from "@/domain/book-filters";
import { useDebounce } from "@/hooks/use-debounce";
import { useToggleFavorite } from "@/hooks/queries/use-book-actions";
import { useBooks } from "@/hooks/queries/use-books";
import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import type { ThemeColors } from "@/theme/tokens";

const PAGE_SIZE = 20;

export default function CatalogueScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useI18n();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<StatusFilter>("tous");
  const [favoriOnly, setFavoriOnly] = useState(false);
  const [sort, setSort] = useState<NormalizedBookFilters["sort"]>("titre");
  const [order, setOrder] = useState<NormalizedBookFilters["order"]>("asc");

  const debouncedSearch = useDebounce(searchInput, 300);

  const filters: NormalizedBookFilters = {
    page,
    limit: PAGE_SIZE,
    sort,
    order,
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(status !== "tous" ? { status } : {}),
    ...(favoriOnly ? { favori: true } : {}),
  };

  const { data, isPending, isError, error, refetch, isFetching } = useBooks(filters);
  const { mutate: toggleFavorite } = useToggleFavorite();

  function handleSearchChange(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  function handleStatusChange(value: StatusFilter) {
    setStatus(value);
    setPage(1);
  }

  function handleFavoriToggle() {
    setFavoriOnly((prev) => !prev);
    setPage(1);
  }

  function handleSortChange(
    newSort: NormalizedBookFilters["sort"],
    newOrder: NormalizedBookFilters["order"],
  ) {
    setSort(newSort);
    setOrder(newOrder);
    setPage(1);
  }

  function handleOpenBook(id: string) {
    router.push(`/books/${id}`);
  }

  function handleAddBook() {
    router.push("/books/new");
  }

  function handleToggleFavorite(book: Book) {
    toggleFavorite({ id: book.id, favori: !book.favori, version: book.version });
  }

  const toolbar = (
    <>
      <SearchBar onSearchChange={handleSearchChange} />
      <BookFilters
        status={status}
        favoriOnly={favoriOnly}
        onStatusChange={handleStatusChange}
        onFavoriToggle={handleFavoriToggle}
      />
      <BookSort sort={sort} order={order} onChange={handleSortChange} />
    </>
  );

  if (isPending) {
    return (
      <View style={styles.container}>
        {toolbar}
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          renderItem={() => <BookCardSkeleton />}
          contentContainerStyle={styles.list}
          accessibilityLabel={t.catalogue.loading}
        />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        {toolbar}
        <StateMessage
          title={t.catalogue.errorTitle}
          description={error.message}
          actionLabel={t.catalogue.retry}
          onAction={() => refetch()}
        />
      </View>
    );
  }

  const books = data.items;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.count}>
          {t.catalogue.title(data.total)}
        </Text>
        <Pressable
          onPress={handleAddBook}
          accessibilityRole="button"
          accessibilityLabel={t.catalogue.add}
          style={styles.addButton}
          hitSlop={8}
        >
          <Text style={styles.addButtonText}>{t.catalogue.add}</Text>
        </Pressable>
      </View>

      {toolbar}

      {books.length === 0 ? (
        <StateMessage
          title={t.catalogue.emptyTitle}
          description={t.catalogue.emptyDescription}
        />
      ) : (
        <FlatList
          data={books}
          keyExtractor={(book: Book) => book.id}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={handleOpenBook}
              onToggleFavorite={handleToggleFavorite}
            />
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
          accessibilityLabel={t.catalogue.previousAccessibilityLabel}
          style={[styles.pageButton, page <= 1 && styles.pageButtonDisabled]}
          hitSlop={8}
        >
          <Text style={styles.pageButtonText}>{t.catalogue.previous}</Text>
        </Pressable>
        <Text style={styles.pageLabel}>
          {t.catalogue.pageLabel(data.page, data.totalPages)}
          {isFetching ? t.catalogue.updating : ""}
        </Text>
        <Pressable
          onPress={() => setPage((p) => Math.min(data.totalPages, p + 1))}
          disabled={page >= data.totalPages}
          accessibilityRole="button"
          accessibilityLabel={t.catalogue.nextAccessibilityLabel}
          style={[styles.pageButton, page >= data.totalPages && styles.pageButtonDisabled]}
          hitSlop={8}
        >
          <Text style={styles.pageButtonText}>{t.catalogue.next}</Text>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 16 },
    count: { fontSize: 14, color: colors.textMuted },
    addButton: { minHeight: 44, paddingHorizontal: 16, justifyContent: "center", backgroundColor: colors.primary, borderRadius: 8 },
    addButtonText: { color: colors.primaryContrast, fontWeight: "600" },
    list: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
    separator: { height: 12 },
    pagination: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderTopWidth: 1, borderTopColor: colors.border },
    pageButton: { minHeight: 44, minWidth: 44, paddingHorizontal: 12, justifyContent: "center", alignItems: "center", backgroundColor: colors.surfaceMuted, borderRadius: 8 },
    pageButtonDisabled: { opacity: 0.4 },
    pageButtonText: { fontWeight: "600", color: colors.text },
    pageLabel: { fontSize: 13, color: colors.textMuted },
  });
}
