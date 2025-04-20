import { AgGrid } from "@codezee/sixtify-brahma";
import type { AgGridReact } from "ag-grid-react";
import { useRef } from "react";
import { useExcelFieldColumns } from "./hooks/useExcelFieldColumns";
import { type ExcelTemplateFields } from "./hooks/useGetAllExcelTemplateFields";

type ExcelFieldListProps = Readonly<{
  loading: boolean;
  excelFields: ExcelTemplateFields[];
}>;

export function ExcelFieldList({
  loading = false,
  excelFields,
}: ExcelFieldListProps) {
  const gridRef = useRef<AgGridReact<ExcelTemplateFields>>(null);

  const { column } = useExcelFieldColumns({
    loading,
  });

  return (
    <AgGrid<ExcelTemplateFields>
      ref={gridRef}
      rowData={excelFields}
      columnDefs={column}
      rowModelType="clientSide"
      height="calc(100vh - 500px)"
    />
  );
}
