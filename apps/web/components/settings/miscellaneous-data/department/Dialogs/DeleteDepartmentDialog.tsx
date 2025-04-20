import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { Department } from "../DepartmentList/hooks/useGetDepartments";
import { useDeleteDepartment } from "./hooks/useDeleteDepartment";

type DeleteDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  department: Department;
};

export const DeleteDepartmentDialog = ({
  department,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteDepartmentDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteDepartment({
    departmentId: department.id,
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
      title={t("department.dialog.delete.message", {
        departmentName: department.department_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
