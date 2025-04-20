import { Stack } from "@mui/material";
import { AttendancePenaltyRuleCard } from "./AttendancePenaltyRule/AttendancePenaltyRuleCard";
import { BankShiftCard } from "./BankShift/BankShiftCard";
import { HolidayCard } from "./Holiday/HolidayCard";
import { useGetEmployeeSchemaDetails } from "./hooks/useGetSchemaDetails";
import { LeavePlanCard } from "./LeavePlan/LeavePlanCard";
import { LoanPolicyCard } from "./LoanPolicy/LoanPolicyCard";
import { OvertimeRuleCard } from "./OvertimeRule/OvertimeRuleCard";
import { ShiftCard } from "./Shift/ShiftCard";
import { WeeklyOffCard } from "./WeeklyOff/WeeklyOffCard";

type SchemaDetailsProps = {
  employeeId: string;
  companyId: string;
  loading: boolean;
};

export const SchemaDetails = ({
  employeeId,
  companyId,
  loading,
}: SchemaDetailsProps) => {
  const { data: schemaDetails, isPending } = useGetEmployeeSchemaDetails({
    employeeId,
  });

  return (
    <Stack gap="15px">
      <Stack direction="row" gap="15px">
        <ShiftCard
          loading={loading || isPending}
          employeeId={employeeId}
          companyId={companyId}
          defaultValues={schemaDetails?.shift_type}
        />

        <WeeklyOffCard
          loading={loading || isPending}
          employeeId={employeeId}
          companyId={companyId}
          defaultValues={schemaDetails?.weekly_off_type}
        />

        <HolidayCard
          loading={loading || isPending}
          employeeId={employeeId}
          companyId={companyId}
          defaultValues={schemaDetails?.holiday_group}
        />
      </Stack>

      <Stack direction="row" gap="15px">
        <AttendancePenaltyRuleCard
          employeeId={employeeId}
          companyId={companyId}
          loading={loading || isPending}
          defaultValues={schemaDetails?.attendance_penalty_rule}
        />

        <OvertimeRuleCard
          companyId={companyId}
          employeeId={employeeId}
          loading={loading || isPending}
          defaultValues={schemaDetails?.overtime_rule}
        />

        <LeavePlanCard
          companyId={companyId}
          employeeId={employeeId}
          loading={loading || isPending}
          defaultValues={schemaDetails?.leave_plan}
        />
      </Stack>

      <Stack direction="row" gap="15px" width="calc(67% - 10px)">
        <BankShiftCard
          loading={loading || isPending}
          employeeId={employeeId}
          companyId={companyId}
          defaultValues={schemaDetails?.bank_shift_type}
        />

        <LoanPolicyCard
          loading={loading || isPending}
          employeeId={employeeId}
          companyId={companyId}
          defaultValues={schemaDetails?.loan_policy}
        />
      </Stack>
    </Stack>
  );
};
