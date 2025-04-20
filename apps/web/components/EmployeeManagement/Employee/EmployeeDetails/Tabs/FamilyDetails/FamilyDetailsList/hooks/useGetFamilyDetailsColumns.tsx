import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import { capitalize } from "lodash";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../utils/date";
import type { FamilyDetails } from "../../Dialog/hooks/useAddFamilyDetails";

type UseFamilyColumnColumnsArgs = {
  onAction?: (actionType: DialogTypes, rowData: FamilyDetails) => void;
};

export const useGetFamilyDetailsColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseFamilyColumnColumnsArgs>) => {
  const column: AgColumnsWithActions<FamilyDetails> = [
    {
      headerName: "Name",
      field: "name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      headerName: "DOB",
      field: "date_of_birth",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Box>{value ? dateFormat(value, true) : "-"}</Box>;
      },
      sortable: true,
    },
    {
      headerName: "Gender",
      field: "gender",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Box>{value ? capitalize(value) : "-"}</Box>;
      },
      sortable: true,
    },
    {
      headerName: "Blood Group",
      field: "blood_group",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Box>{value ? capitalize(value) : "-"}</Box>;
      },
      sortable: true,
    },
    {
      headerName: "Relationship",
      field: "relation",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Box>{value ? capitalize(value) : "-"}</Box>;
      },
      sortable: true,
    },
    {
      headerName: "Profession",
      field: "profession",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ?? "-";
      },
      sortable: true,
    },
    {
      headerName: "Nationality",
      field: "nationality",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return <Box>{value ? capitalize(value) : "-"}</Box>;
      },
      sortable: true,
    },
    {
      headerName: "Address",
      field: "address",
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
      lockPinned: true,
      maxWidth: 70,
      cellRenderer: ({ data }: CustomCellRendererProps<FamilyDetails>) => {
        if (loading || !data) {
          return <LoadingCell />;
        }

        const items = [
          { title: "View", onClick: () => onAction && onAction("view", data) },
          { title: "Edit", onClick: () => onAction && onAction("edit", data) },
          {
            title: "Delete",
            onClick: () => onAction && onAction("delete", data),
          },
        ];

        return <ActionCell items={items}></ActionCell>;
      },
    },
  ];

  return { column };
};
