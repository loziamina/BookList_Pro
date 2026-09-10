import { StyleSheet, View } from "react-native";

import { Skeleton } from "@/components/ui/skeleton";

export function BookCardSkeleton() {
  return (
    <View
      style={styles.card}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Skeleton height={18} width="70%" />
      <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
      <Skeleton height={12} width="50%" style={{ marginTop: 12 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
