"use client";

import { PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import type { LeaveEmployeeDetails } from "../hooks/useGetLeaveEmployeeDetails";
import { PendingLeaveRequestsList } from "./PendingLeaveRequestsList/PendingLeaveRequestsList";

type PendingLeaveRequestsProps = {
  employeeId: string;
  fromDate: string;
  toDate: string;
  leaveDetailsData?: LeaveEmployeeDetails;
  onEditSuccess: () => void;
};

export type PendingLeaveRequestsListRef = {
  refreshPendingLeaveRequestsList: () => void;
};

export const PendingLeaveRequests = ({
  employeeId,
  fromDate,
  toDate,
  leaveDetailsData,
  onEditSuccess,
}: Readonly<PendingLeaveRequestsProps>) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
    <Stack bgcolor={lightBlue[50]} borderRadius="5px">
      <PadBox padding={{ padding: "10px" }}>
        <Typography variant="h6">Pending Leave Requests</Typography>
      </PadBox>

      <PendingLeaveRequestsList
        employeeId={employeeId}
        leaveDetailsData={leaveDetailsData}
        fromDate={fromDate}
        toDate={toDate}
        onEditSuccess={onEditSuccess}
      />
    </Stack>
  );
};

PendingLeaveRequests.displayName = "PendingLeaveRequests";
