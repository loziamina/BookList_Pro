export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  round: 999,
} as const;

export const lightColors = {
  background: "#F7F5F0",
  surface: "#FFFFFF",
  text: "#1D1B18",
  textMuted: "#68635D",
  primary: "#715330",
  primaryContrast: "#FFFFFF",
  border: "#DED8CF",
  danger: "#B42318",
  success: "#287A4D",
} as const;

export const darkColors = {
  background: "#171512",
  surface: "#24211D",
  text: "#F6F1E9",
  textMuted: "#B9B0A5",
  primary: "#D7AD75",
  primaryContrast: "#241A0E",
  border: "#464039",
  danger: "#FF8A80",
  success: "#79D2A3",
} as const;

export type ThemeColors = {
  [Key in keyof typeof lightColors]: string;
};
