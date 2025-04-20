"use client";

import { CardItemValue, formatDate, Tooltip } from "@codezee/sixtify-brahma";
import {
  Avatar,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { capitalize, isEqual } from "lodash";
import { DateTime } from "luxon";
import { calculateLeaveHalf } from "../../PendingLeaveRequestsList/hooks/usePendingLeaveRequestsColumns";
import type { LeaveRequest } from "../hooks/useGetPendingLeaveRequest";

type LeaveDetailsSectionProps = {
  isLeaveRequestDetailsLoading: boolean;
  LeaveRequestDetails?: LeaveRequest;
};

export const getLeaveDays = (fromDate: string, toDate: string) => {
  if (fromDate && toDate) {
    return !isEqual(fromDate, toDate)
      ? `${formatDate(fromDate, "dd LLL")} - ${formatDate(
          toDate,
          "dd LLL, yyyy"
        )}`
      : DateTime.fromISO(fromDate).toFormat("dd LLL, yyyy");
  }
};

export const LeaveDetailsSection = ({
  LeaveRequestDetails,
  isLeaveRequestDetailsLoading,
}: LeaveDetailsSectionProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{
          padding: "15px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: `${slate[800]}`,
          borderRadius: "5px",
        }}
      >
        <Stack direction="row" gap="5px" alignItems="center">
          <Avatar
            src={LeaveRequestDetails?.avatar ?? ""}
            alt="Employee Photo"
            sx={{ width: 40, height: 40 }}
          />

          <CardItemValue
            title={LeaveRequestDetails?.employee_name}
            loading={isLeaveRequestDetailsLoading}
          />
        </Stack>

        <Stack gap="5px" alignItems="center">
          <Typography variant="body1">Leave Date</Typography>

          {isLeaveRequestDetailsLoading ? (
            <Skeleton height={20} width={150} />
          ) : (
            <Typography variant="body2">
              {LeaveRequestDetails &&
                getLeaveDays(
                  LeaveRequestDetails.from_date,
                  LeaveRequestDetails.to_date
                )}
            </Typography>
          )}
        </Stack>
      </Grid>

      <Grid gap="50px" item xs={6}>
        <Typography variant="body1">Leave Days :</Typography>

        <CardItemValue
          title={
            LeaveRequestDetails &&
            `${LeaveRequestDetails.total_leaves} Days ${calculateLeaveHalf(
              LeaveRequestDetails.from_date,
              LeaveRequestDetails.to_date,
              LeaveRequestDetails.from_half,
              LeaveRequestDetails.to_half
            )}`
          }
          loading={isLeaveRequestDetailsLoading}
        />
      </Grid>

      <Grid gap="5px" item xs={6}>
        <Typography variant="body1">Leave Type :</Typography>

        <CardItemValue
          title={capitalize(LeaveRequestDetails?.leave_type)}
          loading={isLeaveRequestDetailsLoading}
        />
      </Grid>

      <Grid gap="5px" item xs={12}>
        <Typography variant="body1">Leave Remark :</Typography>

        <Tooltip toolTipLabel={LeaveRequestDetails?.reason}>
          <CardItemValue
            title={LeaveRequestDetails?.reason}
            loading={isLeaveRequestDetailsLoading}
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
};
