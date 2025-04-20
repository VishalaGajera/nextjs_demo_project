import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import { useDeleteMapLeavePlanType } from "./hooks/useDeleteMapLeavePlanType";

type DeleteMapLeavePlanTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  leavePlanId: string;
  leaveTypeId: string;
  leaveTypeName: string;
};

export const DeleteMapLeavePlanTypeDialog = ({
  leavePlanId,
  leaveTypeId,
  leaveTypeName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteMapLeavePlanTypeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteMapLeavePlanType({
    leavePlanId,
    leaveTypeId,
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
      title={t("leaveType.dialog.delete.message", {
        leaveTypeName,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
