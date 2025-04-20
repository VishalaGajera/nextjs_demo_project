export const EXCEL_MASTER_ROUTES_BASE_URL =
  "api/settings/bulk-data-management/excel-template-configuration/excel-master";

export const EXCEL_MASTER_ROUTES = {
  get: (excelMasterId: string) =>
    `${EXCEL_MASTER_ROUTES_BASE_URL}/${excelMasterId}`,

  options: () => `${EXCEL_MASTER_ROUTES_BASE_URL}/options`,
};
