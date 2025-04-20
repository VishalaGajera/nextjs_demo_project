"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { BANK_SHIFT_PATTERN_ROUTES } from "../../../../../constants/routes/bank-configurations/bank-shift-pattern/routes";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { bankShiftPatternsKeys } from "../../../../../queryKeysFactories/bankShiftPatterns";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { BankShiftPattern } from "../../BankShiftPatternList/hooks/useGetBankShiftPatterns";
import type { BankShiftPatternFormFieldValues } from "../BankShiftPatternForm";

type AddBankShiftPatternApiSuccessResponse =
  ApiSuccessResponse<BankShiftPattern>;

type UseAddBankShiftPatternArgs = {
  options: UseMutationOptions<
    AddBankShiftPatternApiSuccessResponse,
    ApiErrorResponse<BankShiftPatternFormFieldValues>,
    Partial<BankShiftPatternFormFieldValues>
  >;
};

export function useAddBankShiftPattern({
  options = {},
}: UseAddBankShiftPatternArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankShiftPatternsKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddBankShiftPatternApiSuccessResponse>(
          BANK_SHIFT_PATTERN_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
