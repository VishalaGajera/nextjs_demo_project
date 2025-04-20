"use client";

import { CardItemValue, Chip, formatDate } from "@codezee/sixtify-brahma";
import {
  CancelOutlined as CancelIcon,
  CheckCircleOutline as CheckIcon,
  HourglassEmptyOutlined as HourglassIcon,
} from "@mui/icons-material";
import {
  alpha,
  Avatar,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { capitalize } from "lodash";
import { v4 as uuidv4 } from "uuid";
import { dateFormat } from "../../../../../../../utils/date";
import {
  getColorByVariant,
  type StatusType,
} from "../../LeaveBalance/colorVariant";
import { BasicLeaveRequestDetailsSection } from "./BasicLeaveRequestDetailsSection";
import type { LeaveRequest } from "./hooks/useGetPendingLeaveRequest";

type LeaveRequestDetailsCardProps = {
  isLeaveRequestDetailsLoading: boolean;
  LeaveRequestDetails?: LeaveRequest;
};

export const LeaveRequestDetailsCard = ({
  LeaveRequestDetails,
  isLeaveRequestDetailsLoading,
}: LeaveRequestDetailsCardProps) => {
  const theme = useTheme();

  const { slate, iron } = theme.palette.app.color;

  const iconMappings: Record<StatusType, typeof CheckIcon> = {
    approved: CheckIcon,
    rejected: CancelIcon,
    cancelled: CancelIcon,
    pending: HourglassIcon,
  };

  const getStatusIcon = (status: StatusType): JSX.Element => {
    const IconComponent = iconMappings[status];

    return <IconComponent fontSize="small" />;
  };

  return (
    <Stack gap="20px" color={slate[900]}>
      <Stack
        padding="15px"
        direction="row"
        gap="10px"
        alignItems="center"
        bgcolor={slate[800]}
        borderRadius="5px"
      >
        <Avatar
          src={LeaveRequestDetails?.avatar ?? ""}
          alt="Employee Photo"
          sx={{ width: 60, height: 60 }}
        />

        {isLeaveRequestDetailsLoading ? (
          <Stack gap="5px">
            <Skeleton sx={{ width: "200px" }} />

            <Skeleton sx={{ width: "300px" }} />
          </Stack>
        ) : (
          <Stack gap="5px">
            <Typography variant="subtitle1" fontWeight={500}>
              {LeaveRequestDetails?.employee_name}
            </Typography>

            <CardItemValue
              title={
                LeaveRequestDetails &&
                `( Requested By ${LeaveRequestDetails.requested_by} On ${formatDate(LeaveRequestDetails.requested_at, "dd-MM-yyyy • hh:mm a")} )`
              }
              loading={isLeaveRequestDetailsLoading}
            />
          </Stack>
        )}
      </Stack>

      <BasicLeaveRequestDetailsSection
        BasicLeaveRequestDetails={LeaveRequestDetails}
        isBasicLeaveRequestDetailsLoading={isLeaveRequestDetailsLoading}
      />

      <CardItemValue
        title="Reason :"
        subTitle={LeaveRequestDetails?.reason}
        loading={isLeaveRequestDetailsLoading}
      />

      <Stack gap="5px">
        <Typography variant="body1" fontWeight={500}>
          Status :
        </Typography>

        {isLeaveRequestDetailsLoading ? (
          <Skeleton sx={{ width: "150px", lineHeight: "30px" }} />
        ) : (
          LeaveRequestDetails?.status === "pending" && (
            <Chip
              icon={getStatusIcon(LeaveRequestDetails.status)}
              variant="outlined"
              label="Pending"
              sx={{
                width: "fit-content",
                color: getColorByVariant(LeaveRequestDetails.status),
                backgroundColor: alpha(
                  getColorByVariant(LeaveRequestDetails.status) ??
                    "transparent",
                  0.1
                ),
              }}
            />
          )
        )}

        {LeaveRequestDetails?.approver_details?.map((approval) => (
          <Grid
            container
            key={uuidv4()}
            spacing={1}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Grid item xs={2}>
              <Chip
                icon={getStatusIcon(approval.status)}
                variant="outlined"
                label={capitalize(approval.status)}
                sx={{
                  width: "fit-content",
                  color: getColorByVariant(approval.status),
                  backgroundColor: alpha(
                    getColorByVariant(approval.status) ?? "transparent",
                    0.1
                  ),
                }}
              />
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body2" color={iron[500]}>
                {approval?.level_number}
              </Typography>
            </Grid>

            <Grid
              item
              xs={9}
              sx={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <Avatar
                src={approval.avatar ?? null}
                alt="Approver Photo"
                sx={{ width: 30, height: 30 }}
              />
              <Stack direction="column" borderRadius="5px">
                <Stack direction="row" gap="10px" borderRadius="5px">
                  <Typography variant="body2" fontWeight={400}>
                    {approval.employee_name ?? "System Approved"}
                  </Typography>

                  <Typography variant="body2" color={iron[500]}>
                    {approval?.action_at ? dateFormat(approval.action_at) : "-"}
                  </Typography>
                </Stack>

                <Typography variant="body2" fontWeight={400}>
                  {approval.remark ?? "-"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ))}
      </Stack>
    </Stack>
  );
};
