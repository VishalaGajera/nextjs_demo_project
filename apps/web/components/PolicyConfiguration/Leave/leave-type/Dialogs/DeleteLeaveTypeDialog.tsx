import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { LeaveType } from "../LeaveTypeList/hooks/useGetLeaveTypesList";
import { useDeleteLeaveType } from "./hooks/useDeleteLeaveType";

type DeleteLeaveTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  leaveType: LeaveType;
};

export const DeleteLeaveTypeDialog = ({
  leaveType,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLeaveTypeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLeaveType({
    leaveTypeId: leaveType.id,
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
        leaveTypeName: leaveType.leave_type_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
