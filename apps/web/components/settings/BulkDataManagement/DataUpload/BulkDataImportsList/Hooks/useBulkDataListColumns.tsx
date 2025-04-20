import { LoadingCell } from "@codezee/sixtify-brahma";
import { VisibilityOutlined } from "@mui/icons-material";
import { Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import { type DataImportType } from "./useGetBulkDataList";

type UseBulkDataListColumnsArgs = {
  onAction: (actionType: DialogTypes, rowData: DataImportType) => void;
};

export const useBulkDataListColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseBulkDataListColumnsArgs>) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  const columns: AgColumnsWithActions<DataImportType> = [
    {
      headerName: "Excel Template For",
      field: "master_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Excel Template Name",
      field: "template_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },

    {
      headerName: "Import Logs",
      field: "import_log",
      maxWidth: 150,
      cellRenderer: ({ data }: CustomCellRendererProps<DataImportType>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return data ? (
          <VisibilityOutlined
            sx={{
              color: slate[900],
              cursor: "pointer",
            }}
            onClick={() => onAction("view", data)}
          />
        ) : (
          <span>-</span>
        );
      },
      sortable: false,
    },

    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<DataImportType>) => {
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

  return { columns };
};
