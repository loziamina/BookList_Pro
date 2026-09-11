import { useState } from "react";
import { Image, StyleSheet } from "react-native";

import { FALLBACK_COVER_URL, resolveCoverUrl } from "@/services/covers/resolve-cover-url";

type BookCoverProps = {
  couverture: string | null;
  /** Taille d'affichage carrée, en points. */
  size?: number;
};

export function BookCover({ couverture, size = 120 }: BookCoverProps) {
  const [hasLoadError, setHasLoadError] = useState(false);

  const resolvedUrl = resolveCoverUrl(couverture);
  const displayedUrl = hasLoadError ? FALLBACK_COVER_URL : resolvedUrl;

  return (
    <Image
      source={{ uri: displayedUrl }}
      style={[styles.image, { width: size, height: size * 1.5 }]}
      resizeMode="cover"
      onError={() => setHasLoadError(true)}
      accessibilityLabel="Couverture de l'ouvrage"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    backgroundColor: "#e7e5e4",
  },
});