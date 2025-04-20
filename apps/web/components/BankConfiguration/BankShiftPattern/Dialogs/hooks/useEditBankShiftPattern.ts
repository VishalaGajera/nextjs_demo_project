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
import type { BankShiftPatternFormFieldValues } from "../BankShiftPatternForm";

type EditBankShiftPatternApiResponse = ApiSuccessResponse<BankShiftPattern>;

type UseEditBankShiftPatternArgs = {
  options: UseMutationOptions<
    EditBankShiftPatternApiResponse,
    ApiErrorResponse,
    Partial<BankShiftPatternFormFieldValues>
  >;
  bankShiftPatternId: string;
};

export function useEditBankShiftPattern({
  bankShiftPatternId,
  options = {},
}: UseEditBankShiftPatternArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankShiftPatternsKeys.edit(bankShiftPatternId),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.patch<EditBankShiftPatternApiResponse>(
          BANK_SHIFT_PATTERN_ROUTES.patch(bankShiftPatternId),
          formValues
        );

      return data;
    },
    ...options,
  });
}
