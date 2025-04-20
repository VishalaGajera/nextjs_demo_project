import { toasts } from "@codezee/sixtify-brahma";
import { useTheme } from "@mui/material";
import type { GridApi } from "ag-grid-community";
import ExcelJS from "exceljs";
import { isArray } from "lodash";
import { useCallback } from "react";
import { DateTime } from "luxon";
import { useConvertColorFormatHslToHex } from "./useConvertColorFormatHslToHex";

export const toExportDateFormat = (date: string, includeDay = false): string =>
  DateTime.fromISO(date).toFormat(`dd-MM-yyyy${includeDay ? " (EEEE)" : ""}`);

export type ColumnConfig<T> = {
  header: string;
  key: keyof T;
  width?: number;
  formatter?: (value: string) => string;
};

export type ExportToExcelParams<T = Record<string, string>> = {
  gridApi: GridApi;
  fileName?: string;
  sheetName?: string;
  columns?: ColumnConfig<T>[];
  dateKeys?: string[];
  includeDay?: boolean;
};

export const useExcelExport = () => {
  const theme = useTheme();

  const { convertHslToHex } = useConvertColorFormatHslToHex();

  const themeHeadarColor = theme.palette.app?.color?.butterflyBlue[600] ?? "";

  const headerColor = convertHslToHex(themeHeadarColor);

  const exportToExcel = useCallback(
    async <T extends Record<string, string>>(
      params: ExportToExcelParams<T>
    ): Promise<boolean> => {
      const {
        gridApi,
        fileName = "exported_data.xlsx",
        sheetName = "Sheet1",
        columns,
        dateKeys,
        includeDay,
      } = params;

      if (!gridApi) {
        toasts.warning({ title: "No data to export" });

        return false;
      }

      try {
        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(sheetName);

        const rowData: T[] = [];

        const currentPage = gridApi.paginationGetCurrentPage();

        const pageSize = gridApi.paginationGetPageSize();

        gridApi.forEachNode((node, index) => {
          const pageStartIndex = currentPage * pageSize;

          const pageEndIndex = pageStartIndex + pageSize - 1;

          if (index >= pageStartIndex && index <= pageEndIndex && node.data) {
            rowData.push(node.data);
          }
        });

        const effectiveColumns =
          columns ??
          Object.keys(
            isArray(rowData[0]) ? rowData[0] : (rowData[0] ?? {})
          ).map((key) => ({
            header: key.charAt(0).toUpperCase() + key.slice(1),
            key,
            width: Math.max(key.length, 20),
            formatter: (key: string) => key,
          }));

        worksheet.columns = effectiveColumns.map((col) => ({
          header: col.header,
          key: col.key as string,
          width: col.width,
        }));

        const headerRow = worksheet.getRow(1);

        headerRow.alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        headerRow.font = { bold: true };
        headerRow.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: headerColor?.replace("#", "") },
        };
        headerRow.height = 25;

        rowData.forEach((item) => {
          const data = effectiveColumns.map((col) => {
            const rawValue = item[col.key as keyof T] ?? "-";

            const formattedValue =
              dateKeys?.includes(col.key as string) && rawValue !== "-"
                ? toExportDateFormat(rawValue, includeDay)
                : rawValue;

            return col.formatter
              ? col.formatter(formattedValue)
              : formattedValue;
          });

          worksheet.addRow(data);
        });

        worksheet.views = [{ state: "frozen", ySplit: 1 }];

        worksheet.autoFilter = `A1:${String.fromCharCode(
          65 + effectiveColumns.length - 1
        )}1`;

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(link.href);

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        toasts.error({ title: errorMessage || "Excel export failed" });

        return false;
      }
    },
    []
  );

  return {
    exportToExcel,
  };
};
