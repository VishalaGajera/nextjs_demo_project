import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { SubCaste } from "../SubCasteList/hooks/useGetSubCastes";
import { useDeleteSubCaste } from "./hooks/useDeleteSubCaste";

type DeleteSubCasteDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  subCaste: SubCaste;
};

export const DeleteSubCasteDialog = ({
  subCaste,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteSubCasteDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteSubCaste({
    subCasteId: subCaste.id,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("subCaste.dialog.delete.message", {
        subCasteName: subCaste.sub_caste_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
