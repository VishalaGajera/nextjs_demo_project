import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { type MouseEvent } from "react";
import { useNavigateToRoute } from "../../../../../hooks/useNavigateToRoute";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../types/dialogs";
import { dateFormat } from "../../../../../utils/date";
import type { Company } from "./useGetCompanies";

type UseCompanyColumns = {
  onAction: (actionType: DialogTypes, rowData: Company) => void;
};

export const useCompanyColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseCompanyColumns>) => {
  const navigateToNewPage = useNavigateToRoute();

  const theme = useTheme();

  const column: AgColumnsWithActions<Company> = [
    {
      headerName: "Company Name",
      field: "company_name",
      cellRenderer: ({ data }: CustomCellRendererProps<Company>) => {
        if (loading) {
          return <LoadingCell />;
        }

        const { butterflyBlue } = theme.palette.app.color;

        return (
          <Typography
            sx={{
              cursor: "pointer",
              color: butterflyBlue[900],
            }}
            onMouseDown={(e: MouseEvent<HTMLSpanElement>) => {
              if (data?.id) {
                navigateToNewPage(
                  e,
                  `/organization/company/${data.id}?tab=basic-details`
                );
              }
            }}
          >
            {data?.company_name ?? "-"}
          </Typography>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: "Industry",
      field: "industry_name",
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Company>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<Company>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "Delete", onClick: () => onAction("delete", data) },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { column };
};
