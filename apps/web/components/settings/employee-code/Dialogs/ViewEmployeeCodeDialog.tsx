import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { EmployeeCodeFormFieldValues } from "./EmployeeCodeForm";
import { EmployeeCodeForm } from "./EmployeeCodeForm";
import { useGetEmployeeCode } from "./hooks/useGetEmployeeCode";

type ViewEmployeeCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  employeeCodeId: string;
};

export const ViewEmployeeCodeDialog = ({
  employeeCodeId,
  open,
  onClose,
}: ViewEmployeeCodeDialogProps) => {
  const { data: employeeCodeData, isPending: isPendingLatestemployeeCode } =
    useGetEmployeeCode({
      employeeCodeId,
    });

  const defaultValues = useMemo(() => {
    if (employeeCodeData) {
      const {
        company_id,
        employee_code_name,
        series_start,
        is_active,
        prefix,
        suffix,
      } = employeeCodeData;

      const employeeCodeFormFieldValues: EmployeeCodeFormFieldValues = {
        company_id,
        employee_code_name,
        series_start,
        is_active,
        prefix,
        suffix,
      };

      return employeeCodeFormFieldValues;
    }
  }, [employeeCodeData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Employee Code"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <EmployeeCodeForm
        defaultValues={defaultValues}
        loading={isPendingLatestemployeeCode}
        disabled
      />
    </Dialog>
  );
};
