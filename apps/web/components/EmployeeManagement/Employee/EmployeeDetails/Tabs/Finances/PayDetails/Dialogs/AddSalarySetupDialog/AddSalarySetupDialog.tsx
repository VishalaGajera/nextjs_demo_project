import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { salarySetupkeys } from "../../../../../../../../../queryKeysFactories/salarySetup";
import { onError } from "../../../../../../../../../utils/errors";
import type { AddSalarySetupFormRef } from "../../../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/AddSalarySetupForm";
import { AddSalarySetupForm } from "../../../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/AddSalarySetupForm";
import { useAddSalarySetup } from "../../../../../../../../Payroll/EmployeeFinance/EmployeeFinanceDetails/Tabs/PayDetails/Tabs/SalaryOverview/SalarySetup/Hooks/useAddSalarySetup";

type AddSalarySetupDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
};

export const AddSalarySetupDialog = ({
  employeeId,
  onClose,
  open,
}: AddSalarySetupDialogProps) => {
  const formRef = useRef<AddSalarySetupFormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useAddSalarySetup({
    employeeId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });

        queryClient.invalidateQueries({
          queryKey: salarySetupkeys.get(employeeId),
        });

        queryClient.invalidateQueries({
          queryKey: salarySetupkeys.list(),
        });

        onClose();
      },

      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      const payLoad = {
        ...(formValues.is_enable_payroll ? formValues : {}),
        is_enable_payroll: formValues.is_enable_payroll ?? false,
      };

      mutate(payLoad);
    });
  };

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title="Add Salary Details Setup"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onSubmit}
            loading={isPending}
            disabled={isDisabled()}
            variant="contained"
          >
            Save
          </Button>
        </Stack>
      }
    >
      <AddSalarySetupForm ref={formRef} employeeId={employeeId} />
    </Dialog>
  );
};
