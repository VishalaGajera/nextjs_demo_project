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

type EditBankApiResponse = ApiSuccessResponse<Bank>;

type UseEditBankArgs = {
  options: UseMutationOptions<
    EditBankApiResponse,
    ApiErrorResponse<BankFormFieldValues>,
    Partial<BankFormFieldValues>
  >;
  bankId: string;
};

export function useEditBank({ bankId, options = {} }: UseEditBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankKeys.edit(bankId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditBankApiResponse>(
        BANK_ROUTES.patch(bankId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
