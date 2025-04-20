import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";

import { useRouter } from "next/navigation";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import type { PenaltyRules } from "./useGetPenaltyRules";

type UsePenaltyRulesColumns = {
  onAction: (actionType: DialogTypes, rowData: PenaltyRules) => void;
};

export const usePenaltyRulesColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UsePenaltyRulesColumns>) => {
  const router = useRouter();

  const columns: AgColumnsWithActions<PenaltyRules> = [
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
      headerName: "Attendance Penalty Rule Code",
      field: "attendance_penalty_rule_code",
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
      headerName: "Attendance Penalty Rules",
      field: "attendance_penalty_rule_name",
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
      minWidth: 200,
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<PenaltyRules>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<PenaltyRules>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          {
            title: "View",
            onClick: () =>
              router.push(
                `/policy-configuration/attendance/penalty-rules?page=view-penalty-rules&id=${data.id}`
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
