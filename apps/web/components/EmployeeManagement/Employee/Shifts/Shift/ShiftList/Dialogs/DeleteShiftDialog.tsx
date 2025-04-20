import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../../utils/errors";
import { useDeleteShift } from "./hooks/useDeleteShift";

type DeleteShiftDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  shiftId: string;
  shiftName: string | null;
};

export const DeleteShiftDialog = ({
  shiftId,
  shiftName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteShiftDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteShift({
    shiftId,
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
      title={t("shift.dialog.delete.message", {
        shiftName,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
