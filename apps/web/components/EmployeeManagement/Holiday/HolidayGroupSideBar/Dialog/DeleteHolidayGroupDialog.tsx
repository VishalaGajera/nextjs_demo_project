import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import { useDeleteHolidayGroup } from "./hooks/useDeleteHolidayGroup";

type DeleteHolidayGroupDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  holidayGroupId: string;
  holidayGroupName: string | null;
};

export const DeleteHolidayGroupDialog = ({
  holidayGroupId,
  holidayGroupName,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteHolidayGroupDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteHolidayGroup({
    holidayGroupId,
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
      title={t("holidayGroup.dialog.delete.message", {
        holidayGroupName,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
