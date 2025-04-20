import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import type { EmployeeCodeFormFieldValues, FormRef } from "./EmployeeCodeForm";
import { EmployeeCodeForm } from "./EmployeeCodeForm";
import { useEditEmployeeCode } from "./hooks/useEditEmployeeCode";
import { useGetEmployeeCode } from "./hooks/useGetEmployeeCode";

type EditEmployeeCodeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeCodeId: string;
};

export const EditEmployeeCodeDialog = ({
  employeeCodeId,
  open,
  onEditSuccess,
  onClose,
}: EditEmployeeCodeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: employeeCodeData, isPending: isPendingLatestemployeeCode } =
    useGetEmployeeCode({
      employeeCodeId,
    });

  const { mutate, isPending } = useEditEmployeeCode({
    employeeCodeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditEmployeeCode = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (employeeCodeData) {
      const employeeCodeFormFieldValues: EmployeeCodeFormFieldValues = {
        company_id: employeeCodeData.company_id,
        employee_code_name: employeeCodeData.employee_code_name,
        series_start: employeeCodeData.series_start,
        is_active: employeeCodeData.is_active,
        prefix: employeeCodeData.prefix,
        suffix: employeeCodeData.suffix,
      };

      return employeeCodeFormFieldValues;
    }
  }, [employeeCodeData]);

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Employee Code"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditEmployeeCode}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <EmployeeCodeForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestemployeeCode}
      />
    </Dialog>
  );
};
