import { LIST } from "../../../routes";
import { BANK_CONFIGURATIONS_BASE_URL } from "../routes";

export const BANK_SHIFT_PATTERN_ROUTES_BASE_URL = `${BANK_CONFIGURATIONS_BASE_URL}/bank-shift-pattern`;

export const BANK_SHIFT_PATTERN_ROUTES = {
  listing: `${BANK_SHIFT_PATTERN_ROUTES_BASE_URL}/${LIST}`,

  post: BANK_SHIFT_PATTERN_ROUTES_BASE_URL,

  get: (bankShiftTypeId: string) =>
    `${BANK_SHIFT_PATTERN_ROUTES_BASE_URL}/${bankShiftTypeId}`,

  patch: (bankShiftTypeId: string) =>
    `${BANK_SHIFT_PATTERN_ROUTES_BASE_URL}/${bankShiftTypeId}`,

  delete: (bankShiftTypeId: string) =>
    `${BANK_SHIFT_PATTERN_ROUTES_BASE_URL}/${bankShiftTypeId}`,
};
