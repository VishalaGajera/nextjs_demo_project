import { ActionCell, Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useMemo, type MouseEvent } from "react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import { dateFormat } from "../../../../../utils/date";
import type { Employee } from "./useGetEmployees";
import { formatMobileNumber } from "../../../../../utils/formatMobileNumber";

type UseEmployeeColumns = {
  loading: boolean;
  isDraft: boolean;
  handleClickOnEmployee: (
    employeeId: string,
    e: MouseEvent<HTMLSpanElement>
  ) => void;

  onAction: (type: string, rowData: Employee) => void;
};

export const useEmployeeColumns = ({
  loading,
  isDraft,
  onAction,
  handleClickOnEmployee,
}: AgColumnsArgs<UseEmployeeColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const columnsWithoutDraft: AgColumnsWithActions<Employee> = [
    {
      pinned: "left",
      minWidth: 360,
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({ data }: CustomCellRendererProps<Employee>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.avatar && !data?.employee_name) {
          return null;
        }

        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            flex="1"
          >
            <Stack direction="row" gap="10px" alignItems="center">
              <Avatar src={data.avatar} alt="Employee Photo" />

              <Box>
                <Typography
                  sx={{
                    width: "100%",
                    cursor: "pointer",
                    color: butterflyBlue[900],
                  }}
                  onMouseDown={(e) => handleClickOnEmployee(data.id, e)}
                >
                  {data.employee_name ?? "-"}
                </Typography>

                <Typography variant="body2" color={butterflyBlue[400]}>
                  {data.employee_code ?? "-"}
                </Typography>
              </Box>
            </Stack>

            {isDraft && (
              <Chip
                label="Draft"
                size="small"
                color="error"
                variant="outlined"
              />
            )}
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      pinned: "left",
      width: 150,
      maxWidth: 300,
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
      headerName: "Joining Date",
      field: "joining_date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? dateFormat(value, true) : "-"}
          </Typography>
        );
      },
      filter: "agDateColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Date of Birth",
      field: "date_of_birth",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {value ? dateFormat(value, true) : "-"}
          </Typography>
        );
      },
      filter: "agDateColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Email",
      field: "email",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Mobile No",
      field: "mobile_no",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? formatMobileNumber(value) : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Company",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Business Unit",
      field: "business_unit_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Location",
      field: "business_unit_location_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Department",
      field: "department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Sub Department",
      field: "sub_department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Designation",
      field: "designation_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Grade",
      field: "grade_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Work Type",
      field: "work_type_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Skill Type",
      field: "skill_type_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Reporting Manager",
      field: "reporting_manager_name",
      cellRenderer: ({ data }: CustomCellRendererProps<Employee>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack gap="5px" alignItems="center" flexDirection="row">
            {data.reporting_manager_name && (
              <Avatar
                sx={{ width: 24, height: 24 }}
                src={data.reporting_manager_avatar}
                alt="Employee Photo"
              />
            )}

            <Typography variant="body2">
              {data.reporting_manager_name ?? "-"}
            </Typography>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Employee>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack>
            <Typography variant="body2">{data.action_by}</Typography>

            <Typography variant="body2">
              {dateFormat(data.action_at)}
            </Typography>
          </Stack>
        );
      },
    },
  ];

  const draftColumns: AgColumnsWithActions<Employee> = [
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Employee>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  const columns = useMemo(() => {
    return isDraft
      ? [...columnsWithoutDraft, ...draftColumns]
      : [...columnsWithoutDraft];
  }, [isDraft, loading]);

  return { columns };
};
