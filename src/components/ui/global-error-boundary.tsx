import { Component, ErrorInfo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { lightColors, radii, spacing } from "@/theme/tokens";

type GlobalErrorBoundaryProps = {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

export class GlobalErrorBoundary extends Component<
  GlobalErrorBoundaryProps,
  GlobalErrorBoundaryState
> {
  state: GlobalErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): GlobalErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  private retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View accessibilityRole="alert" style={styles.container}>
          <Text style={styles.title}>Une erreur inattendue est survenue</Text>
          <Text style={styles.description}>
            L’application n’a pas pu afficher cet écran. Vous pouvez réessayer.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={this.retry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Réessayer</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: lightColors.background,
  },
  title: {
    color: lightColors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: lightColors.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    minHeight: 44,
    justifyContent: "center",
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: lightColors.primary,
  },
  buttonText: {
    color: lightColors.primaryContrast,
    fontWeight: "600",
  },
});
