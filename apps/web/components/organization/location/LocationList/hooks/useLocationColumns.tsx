import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../types/dialogs";
import { dateFormat } from "../../../../../utils/date";
import HeadsColumnView from "../../../business-unit/BusinessUnitList/HeadsColumnView";
import type { Location } from "./useGetLocations";

type UseCompanyColumns = {
  onAction: (actionType: DialogTypes, rowData: Location) => void;
};

export const useLocationColumns = ({
  onAction,
  loading,
}: AgColumnsArgs<UseCompanyColumns>) => {
  const columns: AgColumnsWithActions<Location> = [
    {
      headerName: "Business Unit",
      field: "business_unit_name",
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
      headerName: "Location Name ",
      field: "location_name",
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
      headerName: "Email",
      field: "email",
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
      headerName: "Location Authorised Person",
      field: "business_unit_location_heads",
      minWidth: 300,

      cellRenderer: ({ data }: CustomCellRendererProps<Location>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.business_unit_location_heads.length) {
          return "-";
        }

        return (
          <HeadsColumnView headsData={data.business_unit_location_heads} />
        );
      },
      sortable: true,
    },
    {
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Location>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<Location>) => {
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
