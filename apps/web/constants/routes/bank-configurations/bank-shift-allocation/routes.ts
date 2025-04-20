import { LIST } from "../../../routes";
import { BANK_CONFIGURATIONS_BASE_URL } from "../routes";

export const BANK_SHIFT_ALLOCATION_BASE_URL = `${BANK_CONFIGURATIONS_BASE_URL}/bank-shift-allocation`;

export const BANK_SHIFT_ALLOCATION_ROUTES = {
  listing: (currentDate: string) =>
    `${BANK_SHIFT_ALLOCATION_BASE_URL}/employee/${LIST}?current_date=${currentDate}`,

  post: `${BANK_SHIFT_ALLOCATION_BASE_URL}/bank-shift`,
};
