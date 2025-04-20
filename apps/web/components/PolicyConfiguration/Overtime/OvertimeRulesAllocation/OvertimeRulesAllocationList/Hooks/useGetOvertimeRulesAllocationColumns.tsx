import { CheckBox, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";

import { type MouseEvent } from "react";
import { useFormContext } from "react-hook-form";
import type { OvertimeRulesAllocationFormValues } from "../../../../../../app/policy-configuration/overtime/overtime-rule-allocation/page";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";
import type { OvertimeRulesAllocationListType } from "./useGetOvertimeRulesAllocationList";

type UseGetOvertimeRulesAllocationColumns = {
  loading: boolean;
  overtimeRulesList: OvertimeRulesAllocationListType[];
  employeeIds: string[];
  handleSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSingleChecked: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
};

export const useGetOvertimeRulesAllocationColumns = ({
  loading,
  employeeIds,
  overtimeRulesList,
  handleSelect,
  handleSingleChecked,
}: AgColumnsArgs<UseGetOvertimeRulesAllocationColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const navigateToNewPage = useNavigateToRoute();

  const { control } = useFormContext<OvertimeRulesAllocationFormValues>();

  const checkboxHeaderComponent = () => (
    <CheckBox
      name="checkAll"
      control={control}
      loading={loading}
      size="small"
      indeterminate={
        employeeIds.length && employeeIds.length < overtimeRulesList.length
          ? true
          : false
      }
      disabled={!overtimeRulesList.length}
      onClick={handleSelect}
    />
  );

  const columns: AgColumnsWithActions<OvertimeRulesAllocationListType> = [
    {
      headerComponent: checkboxHeaderComponent,
      field: "selected",
      minWidth: 50,
      maxWidth: 50,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<OvertimeRulesAllocationListType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <CheckBox
            name={`selectedRecords.${data.id}`}
            control={control}
            loading={loading}
            onClick={(event) => handleSingleChecked(event, data.id)}
            size="small"
          />
        );
      },
      sortable: false,
      filter: false,
    },
    {
      minWidth: 360,
      headerName: "Employee",
      field: "employee_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<OvertimeRulesAllocationListType>) => {
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
                  width: "100%",
                  cursor: "pointer",
                  color: butterflyBlue[900],
                }}
                onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
                  navigateToNewPage(
                    e,
                    `/employee-management/employee/${data.id}?tab=org-post-policy&subtab=policy-details&view=list`
                  );
                }}
              >
                {data.employee_name ?? "-"}
              </Typography>

              <Typography variant="body2" color={butterflyBlue[400]}>
                {data.employee_code ?? "-"}
              </Typography>
            </Box>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 200,
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
      minWidth: 200,
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
      minWidth: 200,
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
      minWidth: 200,
      headerName: "Designation",
      field: "designation_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Reporting Manager",
      field: "reporting_manager_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<OvertimeRulesAllocationListType>) => {
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
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      minWidth: 200,
      headerName: "Overtime Rule",
      field: "overtime_rule_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
  ];

  return { columns };
};
