import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { useParams } from "next/navigation";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import { useGetSalaryStructureById } from "../../../../../EditSalaryStructure/Dialogs/Hooks/useGetSalaryStructureById";
import type { CustomSalaryStructureType } from "./useGetCustomBasedSalaryStructureList";

type UseCustomBasedSalaryStructureColumnsArgs = {
  onAction?: (
    actionType: DialogTypes,
    rowData: CustomSalaryStructureType
  ) => void;
};

type CustomBasedSalaryStructureParams = {
  ssId: string;
};

export const useCustomBasedSalaryStructureColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseCustomBasedSalaryStructureColumnsArgs>) => {
  const params = useParams<CustomBasedSalaryStructureParams>();

  const ssId = params.ssId;

  const { data } = useGetSalaryStructureById({ ssId });

  const defaultSalaryStructureName = data?.salary_structure_name === "Default";

  const columns: AgColumnsWithActions<CustomSalaryStructureType> = [
    {
      headerName: "Salary Structure Name",
      field: "salary_structure_name",
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({
        data,
      }: CustomCellRendererProps<CustomSalaryStructureType>) => {
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
      }: CustomCellRendererProps<CustomSalaryStructureType>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction && onAction("view", data) },
          { title: "Edit", onClick: () => onAction && onAction("edit", data) },
        ];

        if (!defaultSalaryStructureName) {
          items.push({
            title: "Delete",
            onClick: () => onAction && onAction("delete", data),
          });
        }

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
