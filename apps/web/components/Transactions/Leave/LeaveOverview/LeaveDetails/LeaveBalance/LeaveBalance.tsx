"use client";

import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import { Fragment, type ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGetLeaveDetails } from "../hooks/useGetLeaveDetails";
import { LeaveBalanceCard } from "./LeaveBalanceCard";

type leaveBalanceProps = {
  employeeId: string;
  fromDate: string;
  action?: ReactNode;
};

export function LeaveBalance({
  employeeId,
  fromDate,
  action,
}: Readonly<leaveBalanceProps>) {
  const { data, isPending } = useGetLeaveDetails({
    employeeId,
    fromDate,
  });

  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
    <Stack borderRadius="5px" bgcolor={lightBlue[50]}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        padding="10px 15px"
      >
        <Typography variant="h6">Leave Balance</Typography>

        <Box>{action}</Box>
      </Stack>

      <Stack height={388} flexDirection="row" padding="15px 25px" gap="30px">
        {Array.isArray(data) &&
          data.map((leaveBalance) => (
            <Fragment key={leaveBalance?.id || uuidv4()}>
              <LeaveBalanceCard
                key={leaveBalance?.leave_type}
                leaveBalanceData={leaveBalance}
                isPending={isPending}
                employeeId={employeeId}
              />

              <Divider orientation="vertical" variant="middle" flexItem />
            </Fragment>
          ))}
      </Stack>
    </Stack>
  );
}
