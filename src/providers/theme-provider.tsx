import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";

import { darkColors, lightColors, type ThemeColors } from "@/theme/tokens";

type ThemeMode = "light" | "dark" | "system";
type ResolvedScheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  scheme: ResolvedScheme;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: "light",
  scheme: "light",
  colors: lightColors,
  setMode: () => {},
});

const STORAGE_KEY = "booklist:theme-mode";

function loadStoredMode(): ThemeMode {
  if (typeof window === "undefined" || !window.localStorage) {
    return "system";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
}

function persistMode(mode: ThemeMode) {
  if (typeof window === "undefined" || !window.localStorage) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>(() => loadStoredMode());

  useEffect(() => {
    persistMode(mode);
  }, [mode]);

  const scheme: ResolvedScheme =
    mode === "system" ? (systemScheme === "dark" ? "dark" : "light") : mode;

  const colors = scheme === "dark" ? darkColors : lightColors;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      scheme,
      colors,
      setMode: setModeState,
    }),
    [mode, scheme, colors],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
