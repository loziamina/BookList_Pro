import { useCallback } from "react";

import { AppError, isAppError } from "@/domain/app-error";
import {
  useDeleteBookCover,
  useUploadBookCover,
} from "@/hooks/queries/use-book-cover";

function toCoverErrorMessage(error: unknown): string {
  if (!isAppError(error)) {
    return "Une erreur inattendue est survenue.";
  }

  const appError = error as AppError;

  if (appError.type === "payload-too-large") {
    return "L'image est trop lourde (413). Réduisez sa taille puis réessayez.";
  }

  if (appError.type === "unsupported-media") {
    return "Format d'image refusé (415). Utilisez JPEG, PNG ou WebP.";
  }

  if (appError.type === "validation") {
    return (
      appError.fields.couverture ??
      appError.message ??
      "La couverture n'a pas pu être enregistrée."
    );
  }

  return appError.message;
}

export function useBookCoverPanel(bookId: string, version?: number) {
  const uploadCover = useUploadBookCover();
  const deleteCover = useDeleteBookCover();

  const uploadImage = useCallback(
    async (imageDataUrl: string) => {
      await uploadCover.mutateAsync({
        id: bookId,
        imageData: imageDataUrl,
        version,
      });
    },
    [bookId, version, uploadCover],
  );

  const removeCover = useCallback(() => {
    deleteCover.mutate({ id: bookId, version });
  }, [bookId, version, deleteCover]);

  return {
    uploadImage,
    isUploading: uploadCover.isPending,
    uploadError: uploadCover.isError
      ? toCoverErrorMessage(uploadCover.error)
      : null,
    removeCover,
    isRemoving: deleteCover.isPending,
    removeError: deleteCover.isError
      ? toCoverErrorMessage(deleteCover.error)
      : null,
  };
}
