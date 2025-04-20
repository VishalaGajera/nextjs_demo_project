import { LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type MouseEvent } from "react";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { LeaveEmployeeData } from "./useGetLeaveOverviewEmployees";

type UseLeaveColumns = {
  loading: boolean;
};

export const useLeaveOverviewColumns = ({
  loading,
}: AgColumnsArgs<UseLeaveColumns>) => {
  const navigateToNewPage = useNavigateToRoute();

  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const columns: AgColumnsWithActions<LeaveEmployeeData> = [
    {
      headerName: "Employee",
      field: "employee_name",
      minWidth: 300,
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveEmployeeData>) => {
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
                    `/transactions/leave/leave-overview/leave-details/employee/${data?.id}`
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
      headerName: "Department",
      field: "department_name",
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
      headerName: "Sub Department",
      field: "sub_department_name",
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
      headerName: "Designation",
      field: "designation_name",
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
      headerName: "Reporting Manager",
      field: "reporting_manager_name",
      cellRenderer: ({ data }: CustomCellRendererProps<LeaveEmployeeData>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.reporting_manager_name && !data?.reporting_manager_avatar) {
          return "-";
        }

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flex="1"
            sx={{ cursor: "pointer" }}
          >
            <Stack direction="row" gap="10px" alignItems="center">
              <Avatar
                sx={{ width: 24, height: 24 }}
                src={data.reporting_manager_avatar}
                alt="Reporting Manager Photo"
              />
              <Typography
                sx={{
                  width: "100%",
                }}
              >
                {data.reporting_manager_name ?? "-"}
              </Typography>
            </Stack>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Leave Plan",
      field: "leave_plan_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
  ];

  return { columns };
};
