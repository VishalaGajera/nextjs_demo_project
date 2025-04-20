import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { Holiday } from "../HolidayList/hooks/useGetHolidays";
import { useDeleteHoliday } from "./hooks/useDeleteHoliday";

type DeleteHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  holiday: Holiday;
};

export const DeleteHolidayDialog = ({
  holiday,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteHolidayDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteHoliday({
    holidayId: holiday.id,
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
        holidayName: holiday.holiday_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
