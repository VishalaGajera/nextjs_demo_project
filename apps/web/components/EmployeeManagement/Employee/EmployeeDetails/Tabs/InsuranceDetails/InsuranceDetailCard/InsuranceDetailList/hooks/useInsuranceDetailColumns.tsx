import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type { AgColumnsWithActions } from "../../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { InsuranceDetail } from "./useGetInsuranceDetail";

type UseInsuranceDetailColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: InsuranceDetail) => void;
};
export const useInsuranceDetailColumns = ({
  onAction,
  loading,
}: UseInsuranceDetailColumns) => {
  const columns: AgColumnsWithActions<InsuranceDetail> = [
    {
      minWidth: 200,
      headerName: "Insurance Type",
      field: "insurance_type",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? capitalize(value) : "-"}</span>;
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Name Of Insured",
      field: "insured_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Policy Number",
      field: "policy_no",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Sum Insured",
      field: "insured_amount",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Relationship",
      field: "relation",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <span>{value ? capitalize(value) : "-"}</span>;
      },
      sortable: true,
    },

    {
      minWidth: 200,
      headerName: "Issue Date",
      field: "issue_date",
      cellRenderer: ({ data }: CustomCellRendererProps<InsuranceDetail>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {dateFormat(data.issue_date, true)}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Expiry Date",
      field: "expiry_date",
      cellRenderer: ({ data }: CustomCellRendererProps<InsuranceDetail>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {dateFormat(data.expiry_date, true)}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: "Insurance Provider",
      field: "insurance_provider",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      headerName: "",
      field: "action",
      sortable: false,
      pinned: "right",
      maxWidth: 100,
      cellRenderer: ({ data }: CustomCellRendererProps<InsuranceDetail>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction("view", data) },
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
