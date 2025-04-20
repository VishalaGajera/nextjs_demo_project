export const EXCEL_IMPORT = "excel-import";
export const EXCEL_FIELD_MAPPING = "excel-field-mapping";
export const EXCEL_DATA_PREVIEW = "excel-data-preview";
export const EXCEL_OVERVIEW = "overview";

export const categories = {
  [EXCEL_IMPORT]: "Excel Import",
  [EXCEL_FIELD_MAPPING]: "Excel Field Mapping",
  [EXCEL_DATA_PREVIEW]: "Excel Data Preview",
  [EXCEL_OVERVIEW]: "Overview",
};

export type OptionKey = keyof typeof categories;
