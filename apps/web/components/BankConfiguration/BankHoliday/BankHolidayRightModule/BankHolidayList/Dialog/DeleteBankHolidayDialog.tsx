import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import { useDeleteBankHoliday } from "./hooks/useDeleteBankHoliday";

type DeleteBankHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  companyId: string;
  bankHolidayId: string;
  bankHolidayName: string;
};

export const DeleteBankHolidayDialog = ({
  companyId,
  bankHolidayId,
  bankHolidayName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteBankHolidayDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteBankHoliday({
    companyId,
    bankHolidayId,
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
        deleteMessage: `${bankHolidayName}  Bank Holiday`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
