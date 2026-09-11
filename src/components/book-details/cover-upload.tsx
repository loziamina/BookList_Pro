import { useMemo, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useI18n } from "@/providers/i18n-provider";
import { useTheme } from "@/providers/theme-provider";
import { radii, spacing, type ThemeColors } from "@/theme/tokens";

const MAX_DIMENSION_PX = 800;
const JPEG_QUALITY = 0.85;

type CoverUploadProps = {
  hasCover: boolean;
  onUpload: (imageDataUrl: string) => Promise<void> | void;
  onRemove: () => void;
  isUploading?: boolean;
  isRemoving?: boolean;
  uploadError?: string | null;
};

/**
 * Redimensionne une image (fichier navigateur) et renvoie un data URI JPEG,
 * pour éviter d'envoyer une photo brute de plusieurs Mo à l'API.
 */
function resizeImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new window.Image();

    image.onload = () => {
      const scale = Math.min(
        1,
        MAX_DIMENSION_PX / Math.max(image.width, image.height),
      );
      const targetWidth = Math.round(image.width * scale);
      const targetHeight = Math.round(image.height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const context = canvas.getContext("2d");
      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error("Impossible de préparer l'image."));
        return;
      }

      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossible de lire cette image."));
    };

    image.src = objectUrl;
  });
}

export function CoverUpload({
  hasCover,
  onUpload,
  onRemove,
  isUploading,
  isRemoving,
  uploadError,
}: CoverUploadProps) {
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Le sujet n'exige la sélection de fichier que sur navigateur ; on dégrade
  // proprement sur toute autre plateforme plutôt que de planter.
  if (Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.unsupportedText}>
          {t.cover.webOnly}
        </Text>
      </View>
    );
  }

  const isBusy = Boolean(isUploading || isRemoving);
  const displayedError = uploadError ?? localError;

  function handlePickPress() {
    setLocalError(null);
    inputRef.current?.click();
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      const resizedDataUrl = await resizeImageFile(file);
      await onUpload(resizedDataUrl);
    } catch {
      setLocalError(t.cover.processingError);
    }
  }

  return (
    <View style={styles.container}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <View style={styles.actionsRow}>
        <Pressable
          style={styles.actionButton}
          onPress={handlePickPress}
          disabled={isBusy}
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {isUploading ? t.cover.uploading : t.cover.change}
          </Text>
        </Pressable>

        {hasCover ? (
          <Pressable
            style={styles.removeButton}
            onPress={onRemove}
            disabled={isBusy}
            accessibilityRole="button"
          >
            <Text style={styles.removeButtonText}>
              {isRemoving ? t.cover.removing : t.cover.remove}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {displayedError ? <Text style={styles.errorText}>{displayedError}</Text> : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  actionsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  actionButtonText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: "600",
  },
  removeButton: {
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: radii.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  removeButtonText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: "600",
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
  unsupportedText: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: "italic",
  },
  });
}