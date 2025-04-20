import { ActionCell, Chip, LoadingCell } from "@codezee/sixtify-brahma";
import { Stack, Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../utils/date";
import HeadsColumnView from "../../../../../organization/business-unit/BusinessUnitList/HeadsColumnView";
import type { Department } from "./useGetDepartments";

type UseDepartmentColumns = {
  onAction: (actionType: DialogTypes, rowData: Department) => void;
  onActive: (rowData?: Department) => void;
};

export const useDepartmentColumns = ({
  onAction,
  loading,
  onActive,
}: AgColumnsArgs<UseDepartmentColumns>) => {
  const columns: AgColumnsWithActions<Department> = [
    {
      headerName: "Company Name",
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
      headerName: "Department Code",
      field: "department_code",
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
      headerName: "Department Name",
      field: "department_name",
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
      headerName: "Department Authorised Persons",
      field: "department_heads",
      minWidth: 300,

      cellRenderer: ({ data }: CustomCellRendererProps<Department>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data?.department_heads.length) {
          return "-";
        }

        return <HeadsColumnView headsData={data.department_heads} />;
      },
      sortable: true,
    },
    {
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
      headerName: "Action By",
      field: "action_by",
      filter: "agTextColumnFilter",
      sortable: true,
      cellRenderer: ({ data }: CustomCellRendererProps<Department>) => {
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
      maxWidth: 90,
      cellRenderer: ({ data }: CustomCellRendererProps<Department>) => {
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
      cellRenderer: ({ data }: CustomCellRendererProps<Department>) => {
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
