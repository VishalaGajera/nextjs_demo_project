import { ActionCell, Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { CustomEnumFilter } from "../../../../../../utils/ag-grid-custom-filter";
import { dateFormat } from "../../../../../../utils/date";
import type { CasteOptionsOptionsKey } from "../../../../../common/Autocomplete/hooks/useGetCastOptions";
import { CasteOptions } from "../../../../../common/Autocomplete/hooks/useGetCastOptions";
import type { SubCaste } from "./useGetSubCastes";

type UseSubCasteColumnsArgs = {
  onAction: (actionType: DialogTypes, rowData: SubCaste) => void;
  onActive: (rowData?: SubCaste) => void;
};

export const useSubCasteColumns = ({
  onAction,
  loading,
  onActive,
}: AgColumnsArgs<UseSubCasteColumnsArgs>) => {
  const columns: AgColumnsWithActions<SubCaste> = [
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
      headerName: "Caste",
      field: "caste_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value && CasteOptions[value as CasteOptionsOptionsKey];
      },
      filter: CustomEnumFilter,
      filterParams: {
        filterOptions: [
          { label: "GENERAL", value: "open" },
          { label: "SC", value: "sc" },
          { label: "ST", value: "st" },
          { label: "OBC", value: "obc" },
        ],
      },
      sortable: true,
    },
    {
      headerName: "Sub Caste",
      field: "sub_caste_name",
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<SubCaste>) => {
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
      headerName: "Active",
      field: "is_active",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<SubCaste>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return data?.is_active ? (
          <Chip label="Yes" />
        ) : (
          <Chip label="No" color="error" />
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
      cellRenderer: ({ data }: CustomCellRendererProps<SubCaste>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction("view", data) },
          { title: "Edit", onClick: () => onAction("edit", data) },
          { title: "Delete", onClick: () => onAction("delete", data) },
          {
            title: data.is_active ? "Inactive" : "Active",
            onClick: () => {
              // eslint-disable-next-line sonarjs/no-unused-expressions
              data.is_active ? onAction("action", data) : onActive(data);
            },
          },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { columns };
};
