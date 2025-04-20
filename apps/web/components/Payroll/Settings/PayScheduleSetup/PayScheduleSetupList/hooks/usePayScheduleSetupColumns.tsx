import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";

import { capitalize } from "lodash";
import { useRouter } from "next/navigation";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import type { PayScheduleSetup } from "./useGetPayScheduleSetupList";

type UsePayScheduleSetupColumns = {
  onAction: (actionType: DialogTypes, rowData: PayScheduleSetup) => void;
  loading: boolean;
};

export const usePayScheduleSetupColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UsePayScheduleSetupColumns>) => {
  const router = useRouter();

  const columns: AgColumnsWithActions<PayScheduleSetup> = [
    {
      headerName: "Company",
      field: "company_name",
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
      headerName: "Pay Schedule Name",
      field: "pay_schedule_group_name",
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
      headerName: "Pay Frequency",
      field: "frequency",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? capitalize(value) : "-"}</span>;
      },
      sortable: false,
    },
    {
      headerName: "Pay Schedule End",
      field: "end_day_of_month",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <span>{value === -1 ? "Last day of the month" : (value ?? "-")}</span>
        );
      },
      sortable: false,
    },
    {
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<PayScheduleSetup>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<PayScheduleSetup>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          {
            title: "View",
            onClick: () =>
              router.push(
                `/payroll/settings/pay-schedule-setup?page=view-pay-schedule-setup&id=${data.id}`
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
