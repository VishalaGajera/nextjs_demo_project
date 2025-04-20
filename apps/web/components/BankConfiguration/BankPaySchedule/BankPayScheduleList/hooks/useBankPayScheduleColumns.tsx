import { ActionCell, formatDate, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../utils/date";
import { useWeekDaysOptions } from "../../../../common/Autocomplete/hooks/useWeekDaysOptions";
import type { BankPaySchedule } from "./useGetBankPayScheduleList";

type UseBankPayScheduleColumns = {
  onAction: (actionType: DialogTypes, rowData: BankPaySchedule) => void;
  loading: boolean;
};

export const useBankPayScheduleColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseBankPayScheduleColumns>) => {
  const router = useRouter();

  const { weekDaysOptions } = useWeekDaysOptions();

  const columns: AgColumnsWithActions<BankPaySchedule> = [
    {
      headerName: "Company Name",
      field: "company_name",
      minWidth: 300,
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
      headerName: "Month/Year",
      field: "month_year",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? formatDate(value, "LLL-yyyy") : "-";
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

        return capitalize(value) ?? "-";
      },
      filter: CustomEnumFilter,
      filterParams: { filterOptions: weekDaysOptions },
      sortable: true,
    },
    {
      headerName: "Month Days",
      field: "month_days",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Salary Days",
      field: "payable_days",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Total Weekly Off",
      field: "total_weekly_off",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Total Holiday",
      field: "total_holiday",

      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      minWidth: 200,
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<BankPaySchedule>) => {
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
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps<BankPaySchedule>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          {
            title: "View",
            onClick: () =>
              router.push(
                `/bank-configurations/bank-pay-schedule?page=view-bank-pay-schedule&id=${data.id}`
              ),
          },
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
