import { useCallback } from "react";

import { isAppError } from "@/domain/app-error";
import {
    useDeleteBookCover,
    useUploadBookCover,
} from "@/hooks/queries/use-book-cover";

function toErrorMessage(error: unknown): string {
  return isAppError(error) ? error.message : "Une erreur inattendue est survenue.";
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
    uploadError: uploadCover.isError ? toErrorMessage(uploadCover.error) : null,
    removeCover,
    isRemoving: deleteCover.isPending,
    removeError: deleteCover.isError ? toErrorMessage(deleteCover.error) : null,
  };
}