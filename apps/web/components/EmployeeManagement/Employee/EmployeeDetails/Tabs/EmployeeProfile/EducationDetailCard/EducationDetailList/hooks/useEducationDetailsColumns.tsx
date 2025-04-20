import { ActionCell, LoadingCell } from "@codezee/sixtify-brahma";
import { Typography } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { AgColumnsWithActions } from "../../../../../../../../../types/agGrid";
import type { DialogTypes } from "../../../../../../../../../types/dialogs";
import { dateFormat } from "../../../../../../../../../utils/date";
import type { QualificationOptionsKey } from "../../../../../../../../common/Autocomplete/hooks/useGetQualificationOptions";
import { QualificationOptions } from "../../../../../../../../common/Autocomplete/hooks/useGetQualificationOptions";
import type { EducationDetails } from "./useGetEducationDetails";

type UseEmployeeEducationColumns = {
  loading: boolean;
  onAction: (actionType: DialogTypes, rowData: EducationDetails) => void;
};
export const useEducationDetailsColumns = ({
  onAction,
  loading,
}: UseEmployeeEducationColumns) => {
  const columns: AgColumnsWithActions<EducationDetails> = [
    {
      minWidth: 200,
      headerName: "Qualification",
      field: "qualification",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value && QualificationOptions[value as QualificationOptionsKey];
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "From Year",
      field: "from_date",
      cellRenderer: ({ data }: CustomCellRendererProps<EducationDetails>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {dateFormat(data.from_date, true)}
          </Typography>
        );
      },
      sortable: true,
    },
    {
      minWidth: 200,
      headerName: "To Year",
      field: "to_date",
      cellRenderer: ({ data }: CustomCellRendererProps<EducationDetails>) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!data) {
          return null;
        }

        return (
          <Typography variant="body2">
            {dateFormat(data.to_date, true)}
          </Typography>
        );
      },
    },
    {
      minWidth: 200,
      headerName: "Institute",
      field: "institute",
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
      headerName: "CGPA/Percentage",
      field: "percentage_or_grade",
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
      headerName: "Qualification Area",
      field: "qualification_area",
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
      cellRenderer: ({ data }: CustomCellRendererProps<EducationDetails>) => {
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
