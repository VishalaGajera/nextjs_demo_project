import { FormContainer } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { LeaveProrateFirstMonthForm } from "./LeaveProrateFirstMonthForm/LeaveProrateFirstMonthForm";
import { LeaveProrateLastMonthForm } from "./LeaveProrateLastMonthForm/LeaveProrateLastMonthForm";

type LeaveAccrualProrateFormContainerProps = {
  disabled?: boolean;
  formType: string;
};

export const LeaveAccrualProrateFormContainer = ({
  disabled = false,
  formType,
}: LeaveAccrualProrateFormContainerProps) => {
  return (
    <FormContainer>
      <Stack gap="20px">
        <LeaveProrateFirstMonthForm disabled={disabled} formType={formType} />

        <LeaveProrateLastMonthForm disabled={disabled || formType === "edit"} />
      </Stack>
    </FormContainer>
  );
};
