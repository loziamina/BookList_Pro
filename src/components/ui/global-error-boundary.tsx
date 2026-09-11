import { Component, ErrorInfo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

type GlobalErrorBoundaryProps = {
  children: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
};

type ErrorBoundaryCoreProps = GlobalErrorBoundaryProps & {
  styles: ReturnType<typeof createStyles>;
  title: string;
  description: string;
  retryLabel: string;
};

type GlobalErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundaryCore extends Component<
  ErrorBoundaryCoreProps,
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
    const { styles } = this.props;

    if (this.state.hasError) {
      return (
        <View accessibilityRole="alert" style={styles.container}>
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.description}>{this.props.description}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={this.retry}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{this.props.retryLabel}</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

export function GlobalErrorBoundary(props: GlobalErrorBoundaryProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <ErrorBoundaryCore
      {...props}
      styles={styles}
      title={t.common.errorTitle}
      description={t.common.errorDescription}
      retryLabel={t.common.retry}
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: "center",
  },
  button: {
    minHeight: 44,
    justifyContent: "center",
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.primaryContrast,
    fontWeight: "600",
  },
  });
}
