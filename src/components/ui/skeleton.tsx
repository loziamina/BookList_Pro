import { View, StyleSheet } from "react-native";

type SkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
  style?: object;
};

export function Skeleton({ height = 16, width = "100%", style }: SkeletonProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.skeleton, { height, width }, style]}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E2E8F0",
    borderRadius: 6,
  },
});