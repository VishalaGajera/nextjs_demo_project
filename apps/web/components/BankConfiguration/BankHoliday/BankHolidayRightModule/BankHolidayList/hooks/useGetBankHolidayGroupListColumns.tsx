import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";

export type BankHolidayType = {
  id?: string;
  holiday_name: string;
  holiday_date: string;
  is_editable: boolean;
};

type UseGetBankHolidayGroupListColumnsArgs = {
  onAction?: (actionType: DialogTypes, rowData: BankHolidayType) => void;
  loading: boolean;
};

export const useGetBankHolidayGroupListColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseGetBankHolidayGroupListColumnsArgs>) => {
  const column: AgColumnsWithActions<BankHolidayType> = [
    {
      headerName: "Bank Holiday Name",
      field: "holiday_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      sortable: true,
    },
    {
      headerName: "Bank Holiday Date",
      field: "holiday_date",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Box>
            {dateFormat(value, true) ?? "-"}
            {` (${DateTime.fromISO(value).toFormat("cccc")})`}
          </Box>
        );
      },
      sortable: true,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 90,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<BankHolidayType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          {
            title: "View",
            onClick: () => onAction && onAction("view", data),
          },
          { title: "Edit", onClick: () => onAction && onAction("edit", data) },
          {
            title: "Delete",
            onClick: () => onAction && onAction("delete", data),
          },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { column };
};
