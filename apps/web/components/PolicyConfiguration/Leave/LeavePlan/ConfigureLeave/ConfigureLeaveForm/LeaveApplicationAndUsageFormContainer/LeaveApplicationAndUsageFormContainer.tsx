import { FormContainer } from "@codezee/sixtify-brahma";
import { useFormContext } from "react-hook-form";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";
import { LeaveApplicationForm } from "./LeaveApplicationFom/LeaveApplicationFom";
import { LeaveUsageForm } from "./LeaveUsageForm/LeaveUsageForm";

type leaveApplicationAndUsageFormContainerProps = {
  leavePlanId: string;
  leaveTypeId: string;
  disabled: boolean;
};

export const LeaveApplicationAndUsageFormContainer = ({
  leavePlanId,
  leaveTypeId,
  disabled = false,
}: leaveApplicationAndUsageFormContainerProps) => {
  const { watch } = useFormContext<ConfigureLeaveFormFieldValues>();

  const isSystemGenerated = watch("is_system_generated");

  return (
    <FormContainer>
      <LeaveApplicationForm
        leavePlanId={leavePlanId}
        leaveTypeId={leaveTypeId}
        disabled={disabled}
      />

      {!isSystemGenerated && <LeaveUsageForm disabled={disabled} />}
    </FormContainer>
  );
};
