import { CheckBox, getTimeInHHmm, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type MouseEvent } from "react";
import { useFormContext } from "react-hook-form";
import type { ShiftDayFormValues } from "../../../../../../app/transactions/shift-day/shift-day-allocation/page";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";
import type { AgColumnsWithActions } from "../../../../../../types/agGrid";
import { getShiftTypeLabel } from "../../../../../common/Autocomplete/ShiftSchemeAutocomplete";
import type { ShiftDayType } from "./useGetShiftDayList";

type UseShiftDayListColumns = {
  combinedData: ShiftDayType[];
  employeeIds: string[];
  loading: boolean;
  handleSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSingleChecked: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
};

export const useShiftDayListColumns = ({
  loading,
  handleSelect,
  handleSingleChecked,
  employeeIds,
  combinedData,
}: UseShiftDayListColumns) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const { control } = useFormContext<ShiftDayFormValues>();

  const navigateToNewPage = useNavigateToRoute();

  const checkboxHeaderComponent = () => {
    return (
      <CheckBox
        name="checkAll"
        control={control}
        size="small"
        onClick={handleSelect}
        indeterminate={
          (employeeIds.length && employeeIds.length < combinedData.length) ||
          false
        }
        disabled={!combinedData.length}
      />
    );
  };

  const columns: AgColumnsWithActions<ShiftDayType> = [
    {
      headerComponent: checkboxHeaderComponent,
      field: "selected",
      minWidth: 50,
      maxWidth: 50,
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftDayType>) => {
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
            size="small"
            onClick={(event) => handleSingleChecked(event, data.id)}
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
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftDayType>) => {
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
      floatingFilter: false,
    },
    {
      minWidth: 200,
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

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 200,
      headerName: "Sub Department",
      field: "sub_department_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 200,
      headerName: "Designation",
      field: "designation_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 200,
      headerName: "Shift",
      field: "shift_type_name",
      cellRenderer: ({ data }: CustomCellRendererProps<ShiftDayType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack gap="2px" justifyContent="center">
            <Typography variant="body2">
              {data.shift_type_name ?? "-"} (
              {getShiftTypeLabel(data.shift_type ?? "") ?? ""})
            </Typography>

            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? `${getTimeInHHmm(data.shift_start)} - ${getTimeInHHmm(data.shift_end)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 200,
      headerName: "Weekly Off",
      field: "weekly_off_type_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
    {
      minWidth: 200,
      headerName: "Holiday",
      field: "holiday_group_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
      floatingFilter: false,
    },
  ];

  return { columns };
};
