import { LIST, OPTIONS } from "../../../routes";
import { SETTINGS_BASE_URL } from "../routes";

export const SUB_CASTE_ROUTES_BASE_URL = `${SETTINGS_BASE_URL}/sub-caste`;

export const SUB_CASTE_ROUTES = {
  post: SUB_CASTE_ROUTES_BASE_URL,

  delete: (subCasteId: string) => `${SUB_CASTE_ROUTES_BASE_URL}/${subCasteId}`,

  listing: `${SUB_CASTE_ROUTES_BASE_URL}/${LIST}`,

  patch: (subCasteId: string) => `${SUB_CASTE_ROUTES_BASE_URL}/${subCasteId}`,

  get: (subCasteId: string) => `${SUB_CASTE_ROUTES_BASE_URL}/${subCasteId}`,

  options: (castValue: string, employeeId: string) =>
    `${SUB_CASTE_ROUTES_BASE_URL}/${OPTIONS}/${castValue}?employeeId=${employeeId}`,
};
