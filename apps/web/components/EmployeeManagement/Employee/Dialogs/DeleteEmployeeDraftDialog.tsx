import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { Employee } from "../EmployeeList/hooks/useGetEmployees";
import { useDeleteEmployeeDraft } from "./hooks/useDeleteEmployeeDraft";

type DeleteEmployeeDraftDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  employee: Employee;
};

export const DeleteEmployeeDraftDialog = ({
  employee,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteEmployeeDraftDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteEmployeeDraft({
    employeeId: employee.id,
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
      title={t("employeeDraft.dialog.delete.message", {
        employeeName: employee.employee_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
