import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { Grade } from "../GradeList/hooks/useGetGrades";
import { useDeleteGrade } from "./hooks/useDeleteGrade";

type DeleteGradeDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  grade: Grade;
};

export const DeleteGradeDialog = ({
  grade,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteGradeDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteGrade({
    gradeId: grade.id,
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
      title={t("grade.dialog.delete.message", {
        gradeName: grade.grade_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
