import { Autocomplete } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { leaveOverviewKey } from "../../../../../../queryKeysFactories/leaveOverview";
import { Debounce_Delay } from "../../../../../../utils/helper";
import { useGetLeaveBalanceYearOptions } from "../../../../../common/Autocomplete/hooks/useGetLeaveBalanceYearOptions";
import { AddLeaveRequestActionButton } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/AddLeaveRequestActionButton/AddLeaveRequestActionButton";
import { useGetLeaveEmployeeDetails } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/hooks/useGetLeaveEmployeeDetails";
import { LeaveBalance } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveBalance/LeaveBalance";
import { LeaveHistory } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveHistory/LeaveHistory";
import { PendingLeaveRequests } from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/PendingLeaveRequests/PendingLeaveRequests";

type LeaveDetailsSectionProps = Readonly<{
  employeeId: string;
}>;

export const LeaveDetailsSection = ({
  employeeId,
}: LeaveDetailsSectionProps) => {
  const queryClient = useQueryClient();

  const { data: yearPeriodOptions } = useGetLeaveBalanceYearOptions({
    employeeId,
  });

  const currentDate = DateTime.now();

  const formMethods = useForm({
    defaultValues: {
      yearPeriod: "",
    },
  });

  const { control, watch, setValue } = formMethods;

  useMemo(() => {
    const defaultYearPeriod = yearPeriodOptions.find(({ value }) => {
      const [startDate, endDate] = value
        .split("|")
        .map((date) => DateTime.fromISO(date));

      return (
        startDate &&
        endDate &&
        currentDate.startOf("day") >= startDate.startOf("day") &&
        currentDate.startOf("day") <= endDate.startOf("day")
      );
    })?.value;

    if (defaultYearPeriod) {
      setValue("yearPeriod", defaultYearPeriod, { shouldValidate: true });
    }
  }, [yearPeriodOptions]);

  const yearPeriod = watch("yearPeriod");

  const [fromDate = "", toDate = ""] = yearPeriod?.split("|") ?? [];

  const [to_date] = useDebounceValue(
    DateTime.fromISO(toDate)?.toISODate() ?? "",
    Debounce_Delay
  );

  const [from_date] = useDebounceValue(
    DateTime.fromISO(fromDate).toISODate() ?? "",
    Debounce_Delay
  );

  const refreshData = () => {
    const queries = [
      leaveOverviewKey.getRequestList(employeeId, fromDate),
      leaveOverviewKey.getLeaveBalances(employeeId, fromDate),
      leaveOverviewKey.getRequestHistory(employeeId, fromDate),
    ];

    queries.forEach((queryKey) => {
      queryClient.invalidateQueries({ queryKey });
    });
  };

  const { data } = useGetLeaveEmployeeDetails({
    employeeId,
  });

  return (
    <Stack gap="20px">
      <LeaveBalance
        employeeId={employeeId}
        fromDate={from_date}
        action={
          <Stack flexDirection="row" gap="5px" alignItems="center">
            <Autocomplete
              name="yearPeriod"
              placeholder="Select Leave Plan Year"
              control={control}
              disableClearable
              options={yearPeriodOptions}
              sx={{ minWidth: "260px" }}
            />

            <AddLeaveRequestActionButton
              employeeId={employeeId}
              leaveDetailsData={data}
              fromDate={from_date}
              toDate={to_date}
              onAddSuccess={() => refreshData()}
            />
          </Stack>
        }
      />

      <PendingLeaveRequests
        employeeId={employeeId}
        fromDate={fromDate}
        toDate={to_date}
        leaveDetailsData={data}
        onEditSuccess={() => refreshData()}
      />

      <LeaveHistory
        employeeId={employeeId}
        fromDate={fromDate}
        onEditSuccess={() => refreshData()}
      />
    </Stack>
  );
};
