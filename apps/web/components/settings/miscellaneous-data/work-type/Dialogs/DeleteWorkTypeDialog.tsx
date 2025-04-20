import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { WorkType } from "../WorkTypeList/hooks/useGetWorkTypes";
import { useDeleteWorkType } from "./hooks/useDeleteWorklType";

type DeleteWorkTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  workType: WorkType;
};

export const DeleteWorkTypeDialog = ({
  workType,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteWorkTypeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteWorkType({
    workTypeId: workType.id,
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
      title={t("workType.dialog.delete.message", {
        workTypeName: workType.work_type_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
