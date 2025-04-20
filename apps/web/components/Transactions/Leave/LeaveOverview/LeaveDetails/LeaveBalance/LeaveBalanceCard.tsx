"use client";

import { HistoryAction, PieChart } from "@codezee/sixtify-brahma";
import { Skeleton, Stack, Typography, useTheme } from "@mui/material";
import { capitalize } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useDialogActions } from "../../../../../../hooks/useDialogActions";
import type { DialogRenderer } from "../../../../../../types/dialogs";
import type { LeaveBalanceType } from "../hooks/useGetLeaveDetails";
import { LeaveHistoryDialog } from "../LeaveDetailsHistory/LeaveHistoryDialog";

type LeaveBalanceCardProps = {
  isPending: boolean;
  leaveBalanceData?: LeaveBalanceType;
  employeeId: string;
};

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({
  leaveBalanceData,
  employeeId,
  isPending,
}) => {
  const theme = useTheme();

  const { butterflyBlue, mirage } = theme.palette.app.color;

  const {
    leave_type = "paid",
    quota_type = "limited",
    used_leaves = 0,
    available_balance = 0,
    accrual_leave,
    annual_leaves,
    leave_type_colour_code,
  } = leaveBalanceData ?? {};

  const getLeaveValue = (value?: number) =>
    quota_type === "unlimited" ? "∞" : (value ?? 0);

  const leaveBalanceFields = useMemo(
    () => [
      { label: "Used Leave", value: used_leaves ?? 0 },
      { label: "Available Leave", value: getLeaveValue(available_balance) },
      { label: "Accrued Leave So Far", value: getLeaveValue(accrual_leave) },
      { label: "Annual Leave", value: getLeaveValue(annual_leaves) },
    ],
    [quota_type, used_leaves, available_balance, accrual_leave, annual_leaves]
  );

  const series = useMemo(
    () => ({
      cornerRadius: 0,
      innerRadius: 60,
      outerRadius: 80,
      data: [
        {
          value: quota_type === "unlimited" ? 0 : available_balance,
          color: leave_type_colour_code,
        },
        {
          value: used_leaves,
          color: `${leave_type_colour_code}20`,
        },
      ],
    }),
    [leave_type, quota_type, used_leaves, available_balance]
  );

  const valueFormatter = useCallback(
    (item: { value: number }): string => {
      if (item.value === used_leaves && item.value === available_balance) {
        return `Available & Consumed: ${item.value} Days`;
      }

      if (item.value === available_balance) {
        return `Available: ${item.value} Days`;
      }

      if (item.value === used_leaves) {
        return `Consumed: ${item.value} Days`;
      }

      return "Available: 0 Days";
    },
    [used_leaves, available_balance]
  );

  const { openedDialog, onDialogClose, onDialogOpen } = useDialogActions();

  const dialogRenderer: DialogRenderer = useMemo(
    () => ({
      history: leaveBalanceData?.id && (
        <LeaveHistoryDialog
          open
          onClose={onDialogClose}
          leaveTypeId={leaveBalanceData.id}
          employeeId={employeeId}
          dialogTitle={leaveBalanceData.leave_type_name}
        />
      ),
    }),
    [leaveBalanceData, onDialogClose]
  );

  return (
    <Stack gap="20px" justifyContent="space-between" width={250}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Typography
            variant="body1"
            sx={{ fontWeight: 400, color: mirage[400] }}
          >
            {leaveBalanceData?.leave_type_name}
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 400, color: butterflyBlue[400] }}
          >
            {leaveBalanceData?.leave_type
              ? capitalize(leaveBalanceData?.leave_type)
              : "-"}
          </Typography>
        </Stack>
        <HistoryAction onClick={() => onDialogOpen("history")} />
      </Stack>

      {!used_leaves && !available_balance ? (
        <Typography
          variant="body2"
          color={butterflyBlue[400]}
          textAlign="center"
        >
          No Data To Display
        </Typography>
      ) : (
        <PieChart
          key={leave_type}
          height={162}
          series={series}
          loading={isPending}
          tooltip={{ trigger: "item" }}
          valueFormatter={valueFormatter}
          label={`${getLeaveValue(available_balance)} Days`}
        />
      )}

      <Stack gap="10px">
        {leaveBalanceFields.map(({ label, value }) => (
          <Stack direction="row" justifyContent="space-between" key={label}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, color: butterflyBlue[400] }}
            >
              {label}:
            </Typography>

            {isPending ? (
              <Skeleton sx={{ width: "24px" }} />
            ) : (
              <Typography variant="subtitle2" sx={{ fontWeight: 400 }}>
                {value}
              </Typography>
            )}
          </Stack>
        ))}
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </Stack>
  );
};
