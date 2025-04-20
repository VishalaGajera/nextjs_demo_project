import { LoadingCell } from "@codezee/sixtify-brahma";
import { Typography, useTheme } from "@mui/material";
import type { CustomCellRendererProps } from "ag-grid-react";
import type {
  AgColumnsArgs,
  AgColumnsWithActions,
} from "../../../../types/agGrid";
import type { EmployeeData } from "./useGetSectionEmployee";

type useGetSectionEmployeeColumnProps = {
  loading: boolean;
};

export const useGetSectionEmployeeColumn = ({
  loading,
}: AgColumnsArgs<useGetSectionEmployeeColumnProps>) => {
  const theme = useTheme();

  const { butterflyBlue } = theme.palette.app.color;

  const columns: AgColumnsWithActions<EmployeeData> = [
    {
      headerName: "Employee Code",
      field: "employee_code",
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
      headerName: "Employee Name",
      field: "employee_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        if (!value) {
          return null;
        }

        return (
          <Typography
            sx={{
              width: "100%",
              ":hover": {
                color: butterflyBlue[900],
              },
            }}
          >
            {value ?? "-"}
          </Typography>
        );
      },
      filter: "agTextColumnFilter",
      sortable: true,
    },
  ];

  return { columns };
};
