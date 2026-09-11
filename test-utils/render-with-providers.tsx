import { render, type RenderOptions } from "@testing-library/react-native";
import type { ReactElement } from "react";

import { ThemeProvider } from "@/providers/theme-provider";

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions,
) {
  return render(<ThemeProvider>{ui}</ThemeProvider>, options);
}
