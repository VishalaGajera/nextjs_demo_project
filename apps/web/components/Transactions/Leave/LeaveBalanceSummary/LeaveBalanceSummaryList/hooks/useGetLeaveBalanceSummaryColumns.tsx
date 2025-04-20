import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import type { LeaveTypeOptions } from "../../../../../common/Autocomplete/hooks/useGetLeaveTypePerCompanyOptions";
import type { LeaveBalanceSummaryData } from "./useGetLeaveBalanceSummaryList";
import type { MouseEvent } from "react";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";

type LeaveBalanceSummaryColumns = {
  loading: boolean;
  leaveTypes: LeaveTypeOptions[];
  onAction: (actionType: DialogTypes, rowData: LeaveBalanceSummaryData) => void;
};

export const useGetLeaveBalanceSummaryColumns = ({
  onAction,
  loading,
  leaveTypes,
}: AgColumnsArgs<LeaveBalanceSummaryColumns>) => {
  const navigateToNewPage = useNavigateToRoute();

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const leaveBalanceColumns = leaveTypes.map(({ id, name }) => ({
    headerName: name,
    field: name,
    minWidth: 150,
    cellRenderer: ({
      data,
    }: CustomCellRendererProps<LeaveBalanceSummaryData>) => {
      if (loading) {
        return <LoadingCell />;
      }

      const leaveBalance = data?.leave_balance?.find(
        (balance) => balance.leave_type_id === id
      );

      return leaveBalance ? (
        <Typography variant="body2">
          {leaveBalance.quota_type === "limited"
            ? `${leaveBalance.available_balance}/${leaveBalance.annual_quota} Days`
            : "∞"}
        </Typography>
      ) : (
        "-"
      );
    },
    sortable: false,
  }));

  const columns: AgColumnsWithActions<LeaveBalanceSummaryData> = [
    {
      pinned: "left",
      minWidth: 300,
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<LeaveBalanceSummaryData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <Avatar src={data?.avatar ?? ""} alt="Employee Photo" />

            <Box>
              <Typography
                sx={{
                  width: "100%",
                  cursor: "pointer",
                  color: butterflyBlue[900],
                }}
                onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
                  navigateToNewPage(
                    e,
                    `/transactions/leave/leave-balance-summary/leave-details/employee/${data?.id}`
                  );
                }}
              >
                {data?.employee_name ?? "-"}
              </Typography>

              <Typography variant="body2" color={butterflyBlue[400]}>
                {data?.employee_code ?? "-"}
              </Typography>
            </Box>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      minWidth: 100,
      headerName: "Punch Code",
      field: "punch_code",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      minWidth: 170,
      headerName: "Department",
      field: "department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      minWidth: 170,
      headerName: "Leave Plan",
      field: "leave_plan_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    ...leaveBalanceColumns,
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 100,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<LeaveBalanceSummaryData>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Edit", onClick: () => onAction("edit", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
