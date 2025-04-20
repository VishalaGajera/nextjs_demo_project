import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../../utils/errors";
import { PAY_DETAILS, SALARY_OVERVIEW } from "../../../../constants";
import type { AddSalarySetupFormRef } from "./AddSalarySetupForm";
import { AddSalarySetupForm } from "./AddSalarySetupForm";
import { useAddSalarySetup } from "./Hooks/useAddSalarySetup";

type SalarySetupProps = {
  employeeId: string;
};

export const SalarySetup = ({ employeeId }: SalarySetupProps) => {
  const theme = useTheme();

  const { iron, mirage } = theme.palette.app.color;

  const router = useRouter();

  const formRef = useRef<AddSalarySetupFormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const goBack = () => {
    router.push(
      `/payroll/employee-finance/${employeeId}?tab=${PAY_DETAILS}&detail=${SALARY_OVERVIEW}`
    );
  };

  const { mutate, isPending } = useAddSalarySetup({
    employeeId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        goBack();
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
    <Box bgcolor={iron[600]}>
      <PadBox padding={{ padding: "30px" }}>
        <Stack gap="15px">
          <Typography color={mirage[900]} variant="h6">
            Salary Details Setup
          </Typography>

          <AddSalarySetupForm ref={formRef} employeeId={employeeId} />

          <Stack direction="row" gap="5px" justifyContent="flex-end">
            <Button variant="outlined" onClick={() => goBack()}>
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              loading={isPending}
              disabled={isDisabled()}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </PadBox>
    </Box>
  );
};
