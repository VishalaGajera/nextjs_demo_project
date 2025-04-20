import { CheckBox, getTimeInHHmm, LoadingCell } from "@codezee/sixtify-brahma";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type MouseEvent } from "react";
import { useFormContext, type FieldValues } from "react-hook-form";
import { useNavigateToRoute } from "../../../../../../hooks/useNavigateToRoute";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { useWeekDaysOptions } from "../../../../../common/Autocomplete/hooks/useWeekDaysOptions";
import type { BankShiftAllocationFormValues } from "../../BankShiftAllocationDetails";
import { type BankShiftAllocationType } from "./useGetBankShiftAllocation";

type UseBankShiftAllocationColumns = {
  allBankShiftAllocationData: BankShiftAllocationType[];
  employeeIds: string[];
  loading: boolean;
  externalFilter?: FieldValues;
  handleSelect: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleSingleChecked: (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => void;
};

export const useBankShiftAllocationColumns = ({
  allBankShiftAllocationData,
  employeeIds,
  loading,
  handleSelect,
  handleSingleChecked,
}: AgColumnsArgs<UseBankShiftAllocationColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const navigateToNewPage = useNavigateToRoute();

  const { control } = useFormContext<BankShiftAllocationFormValues>();

  const { weekDaysOptions } = useWeekDaysOptions();

  const checkboxHeaderComponent = () => (
    <CheckBox
      indeterminate={
        employeeIds.length &&
        employeeIds.length < allBankShiftAllocationData.length
          ? true
          : false
      }
      disabled={!allBankShiftAllocationData.length}
      name="checkAll"
      control={control}
      loading={loading}
      size="small"
      onClick={handleSelect}
    />
  );

  const columns: AgColumnsWithActions<BankShiftAllocationType> = [
    {
      headerComponent: checkboxHeaderComponent,
      field: "selected",
      minWidth: 50,
      maxWidth: 50,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<BankShiftAllocationType>) => {
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
      }: CustomCellRendererProps<BankShiftAllocationType>) => {
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

        return value ? value : "-";
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

        return value ? value : "-";
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

        return <span>{value ? value : "-"}</span>;
      },
      sortable: true,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Bank Shift",
      field: "bank_shift_type_name",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<BankShiftAllocationType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Stack gap="2px" justifyContent="center">
            <Typography variant="body2">
              {data.bank_shift_type_name ?? "-"}
            </Typography>

            <Typography variant="body2">
              {data.shift_start && data.shift_end
                ? `${getTimeInHHmm(data.shift_start)} - ${getTimeInHHmm(data.shift_end)}`
                : "-"}
            </Typography>
          </Stack>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Weekly Off",
      field: "weekly_off",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: CustomEnumFilter,
      filterParams: { filterOptions: weekDaysOptions },
      sortable: true,
    },
  ];

  return { columns };
};
