import { PadBox, Stepper } from "@codezee/sixtify-brahma";
import { Box, Stack, useTheme } from "@mui/material";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import type { RefObject } from "react";
import { useEffect, useMemo } from "react";
import type {
  ConfigureLeaveFormFieldValues,
  FormRef,
} from "./ConfigureLeaveForm/ConfigureLeaveForm";
import { ConfigureLeaveForm } from "./ConfigureLeaveForm/ConfigureLeaveForm";
import { getStepperLabel, stepperLabel } from "./hooks/helper";

type ConfigureLeaveProps = {
  selectedLeavePlanMonth: string;
  currentStep: number;
  leavePlanId: string;
  leaveTypeId: string;
  configurationStep: string;
  companyId: string;
  formType: string;
  defaultValues?: ConfigureLeaveFormFieldValues;
  formRef: RefObject<FormRef>;
  disabled?: boolean;
};

export const ConfigureLeave = ({
  selectedLeavePlanMonth,
  currentStep,
  leavePlanId,
  leaveTypeId,
  configurationStep,
  companyId,
  formType,
  defaultValues,
  formRef,
  disabled,
}: ConfigureLeaveProps) => {
  const theme = useTheme();

  const { iron } = theme.palette.app.color;

  const router = useRouter();

  const handleFormSteps = (step: string) => {
    if (isEmpty(formRef.current?.errors)) {
      return router.push(
        `/policy-configuration/leave/leave-plan/${leavePlanId}/configure-leave/${formType}/${leaveTypeId}?step=${step}`
      );
    }
  };

  const stepperLabels = useMemo(() => {
    const leaveLimit = formRef.current?.watch("leave_quota.quota_type") ?? "";

    return leaveLimit ? getStepperLabel(leaveLimit) : stepperLabel;
  }, [configurationStep]);

  useEffect(() => {
    handleFormSteps("accrual");
  }, []);

  return (
    <Stack gap={1}>
      <Box bgcolor={iron[600]}>
        <PadBox padding={{ padding: "20px 0px" }}>
          <Stepper
            alternativeLabel
            steps={stepperLabels}
            activeStep={currentStep}
          />
        </PadBox>
      </Box>

      <Box bgcolor={iron[600]}>
        <PadBox padding={{ padding: "30px" }}>
          <ConfigureLeaveForm
            selectedLeavePlanMonth={selectedLeavePlanMonth}
            ref={formRef}
            configurationStep={configurationStep}
            leavePlanId={leavePlanId}
            companyId={companyId}
            leaveTypeId={leaveTypeId}
            defaultValues={defaultValues}
            formType={formType}
            disabled={disabled}
          />
        </PadBox>
      </Box>
    </Stack>
  );
};
