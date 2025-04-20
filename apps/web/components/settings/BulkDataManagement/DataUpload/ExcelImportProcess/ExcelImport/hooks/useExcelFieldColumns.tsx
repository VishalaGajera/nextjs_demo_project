import { LoadingCell } from "@codezee/sixtify-brahma";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import type { CustomCellRendererProps } from "ag-grid-react";
import type { AgColumnsWithActions } from "../../../../../../../types/agGrid";
import type { ExcelTemplateFields } from "./useGetAllExcelTemplateFields";

type UseExcelFieldColumnsArgs = { loading: boolean };

export const useExcelFieldColumns = ({ loading }: UseExcelFieldColumnsArgs) => {
  const column: AgColumnsWithActions<ExcelTemplateFields> = [
    {
      headerName: "Field",
      field: "template_field_name",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : "-";
      },
    },
    {
      headerName: "Description",
      field: "description",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : " -";
      },
    },
    {
      headerName: "Sample Data",
      field: "sample_data",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value ? value : " -";
      },
    },
    {
      headerName: "Mandatory Field",
      field: "required",
      cellRenderer: ({ value }: CustomCellRendererProps) => {
        if (loading) {
          return <LoadingCell />;
        }

        return value && <CheckOutlinedIcon color="success" />;
      },
    },
  ];

  return { column };
};
