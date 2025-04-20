import { getQueryString } from "../../../../utils/helper";
import { OPTIONS } from "../../../routes";

export const EXCEL_TEMPLATE_ROUTES_BASE_URL =
  "api/settings/bulk-data-management/excel-template-configuration";

export type QueryParams = Partial<{
  includeMaster: boolean;
  includeCompany: boolean;
}>;

export const EXCEL_TEMPLATE_ROUTES = {
  post: EXCEL_TEMPLATE_ROUTES_BASE_URL,

  listing: `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/list`,

  get: (excelTemplateId: string) =>
    `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${excelTemplateId}`,

  patch: (excelTemplateId: string) =>
    `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${excelTemplateId}`,

  delete: (excelTemplateId: string) =>
    `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${excelTemplateId}`,

  options: (queryParams: QueryParams = {}) => {
    const queryString = queryParams ? `?${getQueryString(queryParams)}` : "";

    return `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${OPTIONS}${queryString}`;
  },

  getAllFields: (excelTemplateId: string) =>
    `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${excelTemplateId}/template-fields`,

  generateExcel: (excelTemplateId: string) =>
    `${EXCEL_TEMPLATE_ROUTES_BASE_URL}/${excelTemplateId}/generate-excel`,
};
