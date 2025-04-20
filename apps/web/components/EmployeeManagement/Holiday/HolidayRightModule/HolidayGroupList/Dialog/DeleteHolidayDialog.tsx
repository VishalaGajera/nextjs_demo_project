import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../../utils/errors";
import { useDeleteHoliday } from "./hooks/useDeleteHoliday";

type DeleteHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  holidayGroupId: string;
  holidayId: string;
  holidayName: string;
};

export const DeleteHolidayDialog = ({
  holidayGroupId,
  holidayId,
  holidayName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteHolidayDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteHoliday({
    holidayGroupId,
    holidayId,
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
      title={t("holiday.dialog.delete.message", {
        holidayName,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
