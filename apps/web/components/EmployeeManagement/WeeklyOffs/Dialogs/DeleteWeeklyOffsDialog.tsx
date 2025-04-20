import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { WeeklyOffs } from "../WeeklyOffsList/hooks/useGetWeeklyOffs";
import { useDeleteWeeklyOffs } from "./hooks/useDeleteWeeklyOffs";

type DeleteWeeklyOffsDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  weeklyOffs: WeeklyOffs;
};

export const DeleteWeeklyOffsDialog = ({
  weeklyOffs,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteWeeklyOffsDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteWeeklyOffs({
    weeklyOffsId: weeklyOffs.id,
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
      title={t("weeklyOff.dialog.delete.message", {
        weeklyOffName: weeklyOffs.weekly_off_type_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
