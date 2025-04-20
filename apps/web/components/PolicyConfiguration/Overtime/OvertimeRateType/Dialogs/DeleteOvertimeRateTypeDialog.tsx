import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { OvertimeRateType } from "../OvertimeRateTypeList/hooks/useGetOvertimeRateTypes";
import { useDeleteOvertimeRateType } from "./hooks/useDeleteOvertimeRateType";

type DeleteOvertimeRateTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  overtimeRateType: OvertimeRateType;
};

export const DeleteOvertimeRateTypeDialog = ({
  overtimeRateType,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteOvertimeRateTypeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteOvertimeRateType({
    overtimeRateTypeId: overtimeRateType.id,
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
      title={t("overtimeRateType.dialog.delete.message", {
        overtimeRateName: overtimeRateType.overtime_rate_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
