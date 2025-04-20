import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import type { SalaryStructure } from "./useGetSalaryStructureList";

type UseSalaryStructureColumns = {
  loading: boolean;
  handleClickOnEmployee: (ssId: string) => void;
  onAction?: (type: DialogTypes, rowData: SalaryStructure) => void;
};

export const useSalaryStructureColumns = ({
  loading,
  onAction,
  handleClickOnEmployee,
}: AgColumnsArgs<UseSalaryStructureColumns>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const columns: AgColumnsWithActions<SalaryStructure> = [
    {
      maxWidth: 300,
      headerName: "Company Name",
      field: "company_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      maxWidth: 300,
      headerName: "Salary Structure Name",
      field: "salary_structure_name",
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryStructure>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography
            sx={{
              width: "100%",
              cursor: "pointer",
              color: butterflyBlue[900],
            }}
            onClick={() => data && handleClickOnEmployee(data.id)}
          >
            {data?.salary_structure_name ?? "-"}
          </Typography>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      minWidth: 150,
      headerName: "Salary Structure Type",
      field: "structure_types",
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryStructure>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography sx={{ textTransform: "capitalize" }}>
            {data?.structure_types.join(" , ") ?? "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 300,
      headerName: "Salary Structure By",
      field: "salary_intervals",
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryStructure>) => {
        if (loading) {
          return <LoadingCell />;
        }

        return (
          <Typography sx={{ textTransform: "capitalize" }}>
            {data?.salary_intervals.join(" , ") ?? "-"}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "Description",
      field: "description",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
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
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryStructure>) => {
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
      sortable: false,
      pinned: "right",
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps<SalaryStructure>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction && onAction("view", data) },
          ...(data.salary_structure_name !== "Default"
            ? [
                {
                  title: "Edit",
                  onClick: () => onAction && onAction("edit", data),
                },
                {
                  title: "Delete",
                  onClick: () => onAction && onAction("delete", data),
                },
              ]
            : []),
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
