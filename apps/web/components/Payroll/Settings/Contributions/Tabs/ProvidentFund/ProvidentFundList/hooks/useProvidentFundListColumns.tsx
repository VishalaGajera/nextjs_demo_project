import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import type { ProvidentFundRecord } from "./useGetProvidentFundList";

type UseProvidentFundColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: ProvidentFundRecord) => void;
};

export const useProvidentFundColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseProvidentFundColumns>) => {
  const columns: AgColumnsWithActions<ProvidentFundRecord> = [
    {
      headerName: "Group Name",
      field: "epf_group_name",
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
      headerName: "Employee's PF Contribution Rate",
      field: "employee_contribution_rate",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<ProvidentFundRecord>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {data.employee_contribution_rate_type === "percentage"
              ? `${data.employee_contribution_rate}% of Actual PF Wages`
              : `Restrict Contribution to ${data.employee_contribution_rate} of PF Wages`}
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Employer's PF Contribution Rate",
      field: "employer_contribution_rate",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<ProvidentFundRecord>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">
            {data.employer_contribution_rate_type === "percentage"
              ? `${data.employer_contribution_rate}% of Actual PF Wages`
              : `Restrict Contribution to ${data.employer_contribution_rate} of PF Wages`}
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<ProvidentFundRecord>) => {
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
      }: CustomCellRendererProps<ProvidentFundRecord>) => {
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
