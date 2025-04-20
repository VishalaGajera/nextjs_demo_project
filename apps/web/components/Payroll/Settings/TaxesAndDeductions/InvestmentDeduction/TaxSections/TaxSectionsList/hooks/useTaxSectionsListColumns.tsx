import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import { formatToIndianNumber } from "../../../../../../../../utils/helper";
import type { TaxSectionsRecord } from "./useGetTaxSectionsList";

type UseTaxSectionsColumnsProps = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: TaxSectionsRecord) => void;
};

export const useTaxSectionsColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseTaxSectionsColumnsProps>) => {
  const columns: AgColumnsWithActions<TaxSectionsRecord> = [
    {
      headerName: "Section Code",
      field: "section_code",
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
      headerName: "Section Name",
      field: "section_name",
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
      headerName: "Description",
      field: "description",
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
      headerName: "Section Max Limit",
      field: "section_max_limit",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return formatToIndianNumber(value) ?? "-";
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      cellRenderer: ({ data }: CustomCellRendererProps<TaxSectionsRecord>) => {
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
      maxWidth: 70,
      lockPinned: true,
      cellRenderer: ({ data }: CustomCellRendererProps<TaxSectionsRecord>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <ActionCell
            items={[
              { title: "View", onClick: () => onAction("view", data) },
              { title: "Edit", onClick: () => onAction("edit", data) },
              { title: "Delete", onClick: () => onAction("delete", data) },
            ]}
          ></ActionCell>
        );
      },
    },
  ];

  return { columns };
};
