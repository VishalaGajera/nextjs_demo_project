"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../../hooks/useAxiosPrivate";
import { bankKeys } from "../../../../../../queryKeysFactories/bank";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../types/apiResponse";
import type { Bank } from "../../BankList/hooks/useGetBanks";
import type { BankFormFieldValues } from "../BankForm";
import { BANK_ROUTES } from "../../../../../../constants/routes/settings/bank/routes";

type AddBankApiSuccessResponse = ApiSuccessResponse<Bank>;

type UseAddBankArgs = {
  options: UseMutationOptions<
    AddBankApiSuccessResponse,
    ApiErrorResponse<BankFormFieldValues>,
    Partial<BankFormFieldValues>
  >;
};

export function useAddBank({ options = {} }: UseAddBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankKeys.add(),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.post<AddBankApiSuccessResponse>(
        BANK_ROUTES.post,
        formValues
      );

      return data;
    },
    ...options,
  });
}
