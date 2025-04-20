import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import { useDeleteLeavePlan } from "./hooks/useDeleteLeavePlan";

type DeleteLeavePlanDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  currentLeavePlanId: string;
  currentLeavePlanName: string | null;
};

export const DeleteLeavePlanDialog = ({
  currentLeavePlanId,
  currentLeavePlanName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLeavePlanDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLeavePlan({
    currentLeavePlanId,
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
      title={t("leavePlan.dialog.delete.message", {
        currentLeavePlanName,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
