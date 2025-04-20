import { LIST } from "../../../../../routes";
import { TAXES_DEDUCTIONS_BASE_URL } from "../routes";

export const PT_GROUP_ROUTES_BASE_URL = `${TAXES_DEDUCTIONS_BASE_URL}/pt-group`;

export const PT_GROUP_ROUTES = {
  listing: `${PT_GROUP_ROUTES_BASE_URL}/${LIST}`,
  post: `${PT_GROUP_ROUTES_BASE_URL}`,
  get: (id: string) => `${PT_GROUP_ROUTES_BASE_URL}/${id}`,
  update: (id: string) => `${PT_GROUP_ROUTES_BASE_URL}/${id}`,
  delete: (id: string) => `${PT_GROUP_ROUTES_BASE_URL}/${id}`,
};
