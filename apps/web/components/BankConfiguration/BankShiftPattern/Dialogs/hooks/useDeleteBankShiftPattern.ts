"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { BANK_SHIFT_PATTERN_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-shift-pattern/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankShiftPatternsKeys } from "../../../../../queryKeysFactories/bankShiftPatterns";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { BankShiftPattern } from "../../BankShiftPatternList/hooks/useGetBankShiftPatterns";

type DeleteBankShiftPatternApiResponse = ApiSuccessResponse<BankShiftPattern>;

type UseDeleteBankShiftPatternArgs = {
  options: UseMutationOptions<
    DeleteBankShiftPatternApiResponse,
    ApiErrorResponse
  >;
  bankShiftPatternId: string;
};

export function useDeleteBankShiftPattern({
  bankShiftPatternId,
  options = {},
}: UseDeleteBankShiftPatternArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankShiftPatternsKeys.delete(bankShiftPatternId),
    mutationFn: async () => {
      const { data } =
        await axiosPrivate.delete<DeleteBankShiftPatternApiResponse>(
          BANK_SHIFT_PATTERN_ROUTES.delete(bankShiftPatternId)
        );

      return data;
    },
    ...options,
  });
}
