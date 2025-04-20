"use client";

import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounceValue } from "usehooks-ts";
import { leaveOverviewKey } from "../../../../../queryKeysFactories/leaveOverview";
import { Debounce_Delay } from "../../../../../utils/helper";
import { useGetLeaveBalanceYearOptions } from "../../../../common/Autocomplete/hooks/useGetLeaveBalanceYearOptions";
import { LeaveBalance } from "./LeaveBalance/LeaveBalance";
import { LeaveDetailsHeader } from "./LeaveDetailsHeader/LeaveDetailsHeader";
import { LeaveHistory } from "./LeaveHistory/LeaveHistory";
import { PendingLeaveRequests } from "./PendingLeaveRequests/PendingLeaveRequests";
import { useGetLeaveEmployeeDetails } from "./hooks/useGetLeaveEmployeeDetails";

export function LeaveDetails() {
  const params = useParams();

  const queryClient = useQueryClient();

  const employeeId = params.employeeId as string;

  const { data: yearPeriodOptions = [] } = useGetLeaveBalanceYearOptions({
    employeeId,
  });

  const currentDate = DateTime.now();

  const formMethods = useForm({
    defaultValues: {
      yearPeriod: "",
    },
  });

  const { watch, setValue } = formMethods;

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
    DateTime.fromISO(fromDate)?.toISODate() ?? "",
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

  const { data, isPending } = useGetLeaveEmployeeDetails({
    employeeId,
  });

  return (
    <Stack gap="10px">
      <FormProvider {...formMethods}>
        <LeaveDetailsHeader
          employeeId={employeeId}
          yearPeriodOptions={yearPeriodOptions}
          leaveDetailsData={data}
          isPending={isPending}
          fromDate={from_date}
          toDate={to_date}
          onAddSuccess={() => refreshData()}
        />

        <LeaveBalance employeeId={employeeId} fromDate={from_date} />

        <PendingLeaveRequests
          employeeId={employeeId}
          fromDate={from_date}
          toDate={to_date}
          leaveDetailsData={data}
          onEditSuccess={() => refreshData()}
        />

        <LeaveHistory
          employeeId={employeeId}
          fromDate={from_date}
          onEditSuccess={() => refreshData()}
        />
      </FormProvider>
    </Stack>
  );
}
