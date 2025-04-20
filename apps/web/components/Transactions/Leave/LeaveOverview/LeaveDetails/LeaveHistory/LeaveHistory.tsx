"use client";

import { PadBox } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { LeaveHistoryList } from "./LeaveHistoryList/LeaveHistoryList";

type LeaveHistoryProps = {
  employeeId: string;
  fromDate: string;
  onEditSuccess: () => void;
};

export const LeaveHistory = ({
  employeeId,
  fromDate,
  onEditSuccess,
}: Readonly<LeaveHistoryProps>) => {
  const theme = useTheme();

  const { lightBlue } = theme.palette.app.color;

  return (
    <Stack bgcolor={lightBlue[50]} borderRadius="5px">
      <PadBox padding={{ padding: "10px" }}>
        <Typography variant="h6">Leave History</Typography>
      </PadBox>

      <LeaveHistoryList
        employeeId={employeeId}
        fromDate={fromDate}
        onEditSuccess={onEditSuccess}
      />
    </Stack>
  );
};

LeaveHistory.displayName = "LeaveHistory";
