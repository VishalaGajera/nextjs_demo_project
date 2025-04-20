import { ActionCell, Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import { formatToIndianNumber } from "../../../../../../../../utils/helper";
import type { InvestmentSchemesRecord } from "./useGetInvestmentSchemesList";

type UseInvestmentSchemesColumnsProps = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: InvestmentSchemesRecord) => void;
};

export const useInvestmentSchemesColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseInvestmentSchemesColumnsProps>) => {
  const columns: AgColumnsWithActions<InvestmentSchemesRecord> = [
    {
      headerName: "Tax Section Code",
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
      headerName: "Scheme Code",
      field: "scheme_code",
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
      headerName: "Scheme Name",
      field: "scheme_name",
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
      headerName: "Minimum Limit",
      field: "min_limit",
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
      headerName: "Maximum Limit",
      field: "max_limit",
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
      headerName: "Proof Required",
      field: "is_proof_required",
      cellRenderer: ({ data }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        if (data?.is_proof_required) {
          return <Chip label="Yes" />;
        }

        return <Chip label="No" color="error" />;
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<InvestmentSchemesRecord>) => {
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
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<InvestmentSchemesRecord>) => {
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
