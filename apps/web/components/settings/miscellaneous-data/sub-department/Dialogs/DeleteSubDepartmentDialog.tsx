import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { SubDepartment } from "../SubDepartmentList/hooks/useGetSubDepartments";
import { useDeleteSubDepartment } from "./hooks/useDeleteSubDepartment";

type DeleteSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  subDepartment: SubDepartment;
};

export const DeleteSubDepartmentDialog = ({
  subDepartment,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteSubDepartmentDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteSubDepartment({
    subDepartmentId: subDepartment.id,
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
      title={t("subDepartment.dialog.delete.message", {
        subDepartmentName: subDepartment.sub_department_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
