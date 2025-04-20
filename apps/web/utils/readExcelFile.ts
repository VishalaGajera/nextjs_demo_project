import { type CellValue, type Row, type Worksheet, Workbook } from "exceljs";

// Define clear interfaces for the data structure
export type ExcelData = {
  titles: string[];
  rows: Record<string, unknown>[];
};

type ExcelReaderOptions = {
  sheetIndex?: number;
  headerRowIndex?: number;
};

/**
 * Reads and parses an Excel file into a structured format
 * @param file - The Excel file to read
 * @param options - Optional configuration for reading the file
 * @returns Promise containing the parsed Excel data
 */

/**
 * Converts a File object to ArrayBuffer
 */
const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        if (!(event.target?.result instanceof ArrayBuffer)) {
          reject(new Error("Failed to read file as ArrayBuffer"));

          return;
        }
        resolve(event.target.result);
      };

      reader.onerror = () => reject(new Error("Error reading file"));
      reader.readAsArrayBuffer(file);
    }
  });
};

/**
 * Extracts headers from the worksheet
 */
const extractHeaders = (
  worksheet: Worksheet,
  headerRowIndex: number
): string[] => {
  const headerRow = worksheet.getRow(headerRowIndex);

  if (!headerRow?.values) {
    throw new Error("Header row is undefined or empty");
  }

  return Array.isArray(headerRow.values)
    ? headerRow.values
        .slice(1)
        .map((header: CellValue) =>
          header instanceof Date ? header.toISOString() : String(header)
        )
    : [];
};

/**
 * Extracts data rows from the worksheet
 */
const extractRows = (
  worksheet: Worksheet,
  headers: string[],
  headerRowIndex: number
): Record<string, unknown>[] => {
  const rows: Record<string, unknown>[] = [];

  worksheet.eachRow((row: Row, rowNumber: number) => {
    if (rowNumber <= headerRowIndex) {
      return;
    }

    const rowData: Record<string, unknown> = {};

    headers.forEach((header, index) => {
      rowData[header] = row.getCell(index + 1).value;
    });
    rows.push(rowData);
  });

  return rows;
};

export const readExcelFile = async (
  file: File,
  options: ExcelReaderOptions = {}
): Promise<ExcelData> => {
  const { sheetIndex = 0, headerRowIndex = 1 } = options;

  // Convert File to ArrayBuffer
  const arrayBuffer = await readFileAsArrayBuffer(file);

  // Load workbook and get worksheet
  const workbook = new Workbook();

  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.worksheets[sheetIndex];

  if (!worksheet) {
    throw new Error(`Sheet at index ${sheetIndex} not found`);
  }

  // Extract headers
  const headers = extractHeaders(worksheet, headerRowIndex);

  // Extract rows
  const rows = extractRows(worksheet, headers, headerRowIndex);

  return { titles: headers, rows };
};
