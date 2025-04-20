"use client";

import { Autocomplete } from "@codezee/sixtify-brahma";
import {
  Avatar,
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { OptionsType } from "../../../../../../types/options";
import { AddLeaveRequestActionButton } from "../AddLeaveRequestActionButton/AddLeaveRequestActionButton";
import type { LeaveEmployeeDetails } from "../hooks/useGetLeaveEmployeeDetails";

type LeaveDetailsHeaderProps = {
  employeeId: string;
  fromDate: string;
  toDate: string;
  leaveDetailsData?: LeaveEmployeeDetails;
  isPending: boolean;
  yearPeriodOptions: OptionsType[];
  onAddSuccess: () => void;
};

export function LeaveDetailsHeader({
  employeeId,
  fromDate,
  toDate,
  leaveDetailsData,
  isPending,
  yearPeriodOptions,
  onAddSuccess,
}: Readonly<LeaveDetailsHeaderProps>) {
  const theme = useTheme();

  const { lightBlue, iron } = theme.palette.app.color;

  const { control } = useFormContext();

  return (
    <Stack
      flexDirection="row"
      bgcolor={lightBlue[50]}
      padding="10px"
      borderRadius="5px"
      justifyContent="space-between"
    >
      <Stack flexDirection="row" gap="15px" alignItems="center">
        <Avatar
          sx={{ height: "50px", width: "50px" }}
          src={leaveDetailsData?.avatar ?? ""}
        />

        <Box>
          {isPending ? (
            <Skeleton height="30px" width="150px" />
          ) : (
            <Typography variant="subtitle1" fontWeight={500}>
              {leaveDetailsData?.employee_name}
            </Typography>
          )}

          {isPending ? (
            <Skeleton height="24px" width="100px" />
          ) : (
            <Typography variant="subtitle2" color={iron[500]}>
              {leaveDetailsData?.designation_name}
            </Typography>
          )}
        </Box>
      </Stack>

      <Stack flexDirection="row" gap="5px" alignItems="center">
        <Autocomplete
          name="yearPeriod"
          placeholder="Select Leave Plan Year"
          disableClearable
          options={yearPeriodOptions}
          control={control}
          sx={{ minWidth: "260px" }}
        />

        <AddLeaveRequestActionButton
          employeeId={employeeId}
          onAddSuccess={onAddSuccess}
          leaveDetailsData={leaveDetailsData}
          fromDate={fromDate}
          toDate={toDate}
        />
      </Stack>
    </Stack>
  );
}
