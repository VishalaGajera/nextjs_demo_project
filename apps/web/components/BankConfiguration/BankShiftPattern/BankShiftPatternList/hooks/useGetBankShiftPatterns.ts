import { useQuery } from "@tanstack/react-query";
import type { IGetRowsParams } from "ag-grid-community";
import { BANK_SHIFT_PATTERN_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-shift-pattern/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankShiftPatternsKeys } from "../../../../../queryKeysFactories/bankShiftPatterns";
import type { QuickFilter } from "../../../../../types/agGrid";
import type { ApiSuccessResponse } from "../../../../../types/apiResponse";

export type BankShiftPattern = {
  id: string;
  company_name: string;
  bank_shift_pattern_name: string;
  pattern_type: string;
  pattern_repeat: number;
  action_by: string;
  action_at: string;
  full_count: string;
};

type GetBankShiftPatternsArgs = {
  body?:
    | IGetRowsParams
    | QuickFilter
    | Partial<{
        is_active: boolean;
        responseFields: string[];
      }>;
};

export function useGetBankShiftPatternsQueryFn() {
  const { axiosPrivate } = useAxiosPrivate();

  const getBankShiftPatterns = async ({ body }: GetBankShiftPatternsArgs) => {
    const { data } = await axiosPrivate.post<
      ApiSuccessResponse<{
        bankShiftPatterns: BankShiftPattern[];
        totalCount: number;
      }>
    >(BANK_SHIFT_PATTERN_ROUTES.listing, body);

    return data.data;
  };

  return { getBankShiftPatterns };
}

export function useGetBankShiftPatterns({ body }: GetBankShiftPatternsArgs) {
  const { getBankShiftPatterns } = useGetBankShiftPatternsQueryFn();

  return useQuery({
    queryKey: bankShiftPatternsKeys.listing(body),
    queryFn: () => getBankShiftPatterns({ body }),
    initialData: { bankShiftPatterns: [], totalCount: 0 },
  });
}
