import { useTheme } from "@mui/material";
import type { Column, GridApi, IRowNode } from "ag-grid-community";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { toExportDateFormat } from "./useExcelExport";
import { useConvertColorFormatHslToHex } from "./useConvertColorFormatHslToHex";

pdfMake.vfs = pdfFonts.vfs;

const getColumnHeaders = (filteredColumns: Column[], headerColor: string) => {
  return filteredColumns.map((column) => ({
    text: column.getColDef().headerName ?? "",
    bold: true,
    fillColor: `${headerColor}`,
    alignment: "center",
    margin: [0, 8, 0, 0],
  }));
};

const getRowData = (
  node: IRowNode,
  gridApi: GridApi,
  filteredColumns: Column[],
  dateKeys?: string[],
  includeDay?: boolean
) => {
  return filteredColumns.map((column) => {
    const field = column.getColId();

    let cellValue = gridApi.getCellValue({ rowNode: node, colKey: field });

    if (cellValue === null || cellValue === "") {
      cellValue = "-";
    }

    const formattedValue =
      dateKeys?.includes(field) && cellValue !== "-"
        ? toExportDateFormat(cellValue, includeDay)
        : cellValue;

    return {
      text: formattedValue,
      ...column.getColDef().cellStyle,
    };
  });
};

const generatePDFDocument = (
  gridApi: GridApi,
  headerColor: string,
  columnsToRemove?: string[],
  dateKeys?: string[],
  tableBorderColor?: string,
  includeDay?: boolean
): TDocumentDefinitions => {
  const columns = gridApi.getAllDisplayedColumns();

  const filteredColumns = columns.filter(
    (column) => !columnsToRemove?.includes(column.getColId())
  );

  const headerRow = getColumnHeaders(filteredColumns, headerColor);

  const rows: { text: string }[][] = [];

  const currentPage = gridApi.paginationGetCurrentPage();

  const pageSize = gridApi.paginationGetPageSize();

  gridApi.forEachNode((node: IRowNode, index) => {
    const pageStartIndex = currentPage * pageSize;

    const pageEndIndex = pageStartIndex + pageSize - 1;

    if (index >= pageStartIndex && index <= pageEndIndex && node.data) {
      rows.push(
        getRowData(node, gridApi, filteredColumns, dateKeys, includeDay)
      );
    }
  });

  return {
    pageOrientation: "landscape",
    content: [
      {
        table: {
          headerRows: 1,
          widths: Array(filteredColumns.length).fill(
            `${100 / filteredColumns.length}%`
          ),
          body: [headerRow, ...rows],
          heights: (rowIndex: number) => (rowIndex === 0 ? 40 : 20),
          dontBreakRows: true,
        },
        layout: {
          hLineColor: tableBorderColor,
          vLineColor: tableBorderColor,
        },
      },
    ],

    pageMargins: [10, 10, 10, 10],
    defaultStyle: {
      fontSize: 8,
    },
  };
};

export type PdfExportOptions = {
  fileName: string;
  columnsToRemove?: string[];
  dateKeys?: string[];
  includeDay?: boolean;
};

export const useAgGridPdfExport = () => {
  const theme = useTheme();

  const { convertHslToHex } = useConvertColorFormatHslToHex();

  const themeHeadarColor = theme.palette.app.color.butterflyBlue[600] ?? "";

  const themeBorderColor = theme.palette.app.color.iron[800] ?? "";

  const headerColor = convertHslToHex(themeHeadarColor) ?? "";

  const tableBorderColor = convertHslToHex(themeBorderColor) ?? "";

  const exportToPDF = (gridApi: GridApi, options: PdfExportOptions): void => {
    const { fileName, columnsToRemove, dateKeys, includeDay } = options;

    const doc = generatePDFDocument(
      gridApi,
      headerColor,
      columnsToRemove,
      dateKeys,
      tableBorderColor,
      includeDay
    );

    pdfMake.createPdf(doc).download(fileName);
  };

  return { exportToPDF };
};
