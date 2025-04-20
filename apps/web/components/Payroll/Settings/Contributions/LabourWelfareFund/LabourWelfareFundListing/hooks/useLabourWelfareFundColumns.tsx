import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { DateTime } from "luxon";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../../utils/date";
import type { LabourWelfareFund } from "./useListLabourWelfareFund";

type UseLabourWelfareFundColumns = {
  onAction: (actionType: DialogTypes, rowData: LabourWelfareFund) => void;
};

const deductionCycleLabel = (value: string) => {
  switch (value) {
    case "half_yearly":
      return "Half Yearly";

    case "monthly":
      return "Monthly";

    case "yearly":
      return "Yearly";

    default:
      return "-";
  }
};

export const useLabourWelfareFundColumns = ({
  loading,
  onAction,
}: AgColumnsArgs<UseLabourWelfareFundColumns>) => {
  const column: AgColumnsWithActions<LabourWelfareFund> = [
    {
      headerName: "State",
      field: "state_name",
      cellRenderer: ({ value }: CustomCellRendererProps<LabourWelfareFund>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Deduction Cycle",
      field: "deduction_cycle_type",
      cellRenderer: ({ value }: CustomCellRendererProps<LabourWelfareFund>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography variant="body2">{deductionCycleLabel(value)}</Typography>
        );
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { value: "half_yearly", label: "Half Yearly" },
          { value: "monthly", label: "Monthly" },
          { value: "yearly", label: "Yearly" },
        ],
      },
      sortable: true,
    },

    {
      headerName: "Contribution Start Month",
      field: "contribution_start_month",
      cellRenderer: ({ data }: CustomCellRendererProps<LabourWelfareFund>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {DateTime.fromObject({
              month: data.contribution_start_month,
            }).toFormat("MMM")}
          </Typography>
        );
      },
      filter: "agNumberColumnFilter",
      sortable: true,
    },
    {
      headerName: "Deduction Month",
      field: "deduction_months",
      cellRenderer: ({ data }: CustomCellRendererProps<LabourWelfareFund>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {data.deduction_months
              ?.map((month) => DateTime.fromObject({ month }).toFormat("MMM"))
              .join(", ")}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<LabourWelfareFund>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<LabourWelfareFund>) => {
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

  return { column };
};
