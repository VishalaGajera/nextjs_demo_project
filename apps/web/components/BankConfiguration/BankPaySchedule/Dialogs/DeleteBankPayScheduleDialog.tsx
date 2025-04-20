import { DeleteDialog, formatDate, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { BankPaySchedule } from "../BankPayScheduleList/hooks/useGetBankPayScheduleList";
import { useDeleteBankPaySchedule } from "./hooks/useDeleteBankPaySchedule";

type DeleteBankPayScheduleDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  bankPaySchedule: BankPaySchedule;
};

export const DeleteBankPayScheduleDialog = ({
  bankPaySchedule,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBankPayScheduleDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBankPaySchedule({
    bankPayScheduleId: bankPaySchedule.id,
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
      title={t("dialog.delete.message", {
        deleteMessage: `${formatDate(bankPaySchedule.month_year, "LLL-yyyy")} Bank Pay Schedule`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
