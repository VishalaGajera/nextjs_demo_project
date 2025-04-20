import { LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { MouseEvent } from "react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import { formatToIndianNumber } from "../../../../../utils/helper";
import type { EmployeeFinanceListType } from "./useGetEmployeeFinanceList";

type UseEmployeeFinanceColumns = {
  loading: boolean;
  onAction?: (type: string, rowData: EmployeeFinanceListType) => void;
  handleClickOnEmployee: (
    employeeId: string,
    e: MouseEvent<HTMLSpanElement>
  ) => void;
};

export const useEmployeeFinanceColumns = ({
  loading,
  handleClickOnEmployee,
}: AgColumnsArgs<UseEmployeeFinanceColumns>) => {
  const theme = useTheme();

  const { butterflyBlue, red } = theme.palette.app.color;

  const columns: AgColumnsWithActions<EmployeeFinanceListType> = [
    {
      minWidth: 300,
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<EmployeeFinanceListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.avatar && !data?.employee_name) {
          return null;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <Avatar src={data.avatar} alt="Employee Photo" />

            <Box>
              <Typography
                sx={{
                  cursor: "pointer",
                  color: butterflyBlue[900],
                }}
                onMouseDown={(e) => handleClickOnEmployee(data.id, e)}
              >
                {data.employee_name}
              </Typography>

              <Typography variant="body2" color={butterflyBlue[400]}>
                {data.employee_code}
              </Typography>
            </Box>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 150,
      headerName: "Pun Code",
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
      minWidth: 200,
      headerName: "Department",
      field: "department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Typography variant="body2">{value ?? "-"}</Typography>;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Sub Department",
      field: "sub_department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Typography variant="body2">{value ?? "-"}</Typography>;
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
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
      minWidth: 200,
      headerName: "Reporting Manager",
      field: "reporting_manager_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<EmployeeFinanceListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack direction="row" gap="10px" alignItems="center">
            <Avatar
              sx={{ width: 24, height: 24 }}
              src={data.reporting_manager_avatar}
              alt="Reporting Manager Photo"
            />

            <Typography>{data.reporting_manager_name ?? "-"}</Typography>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Salary",
      field: "salary",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? (
          formatToIndianNumber(value)
        ) : (
          <Typography variant="body2" sx={{ color: red[900] }}>
            Salary Setup Pending
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
  ];

  return { columns };
};
