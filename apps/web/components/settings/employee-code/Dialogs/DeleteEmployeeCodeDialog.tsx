import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../utils/errors";
import type { EmployeeCode } from "../EmployeeCodeList/hooks/useGetEmployeeCodes";
import { useDeleteEmployeeCode } from "./hooks/useDeleteEmployeeCode";

type DeleteEmployeeCodDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  employeeCode: EmployeeCode;
};

export const DeleteEmployeeCodeDialog = ({
  employeeCode,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteEmployeeCodDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteEmployeeCode({
    employeeCodeId: employeeCode.id,
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
      title={t("employeeCode.dialog.delete.message", {
        employeeCodeName: employeeCode.employee_code_name,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
