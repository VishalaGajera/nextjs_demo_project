import { SETTINGS_BASE_URL } from "../../routes";

export const BULK_DATA_UPLOAD_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/bulk-data-management/data-upload`;

export const BULK_DATA_UPLOAD_ROUTES = {
  post: (excelTemplateId: string, masterCode: string) =>
    `${BULK_DATA_UPLOAD_ROUTES_BASE_URL}/insert/${excelTemplateId}?masterCode=${masterCode}`,

  listing: `${BULK_DATA_UPLOAD_ROUTES_BASE_URL}/list`,
};
