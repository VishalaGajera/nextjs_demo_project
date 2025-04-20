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
import { BANK_ROUTES } from "../../../../../../constants/routes/settings/bank/routes";

type DeleteBankApiResponse = ApiSuccessResponse<Bank>;

type UseDeleteBankArgs = {
  options: UseMutationOptions<DeleteBankApiResponse, ApiErrorResponse>;
  bankId: string;
};

export function useDeleteBank({ bankId, options = {} }: UseDeleteBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: bankKeys.delete(bankId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteBankApiResponse>(
        BANK_ROUTES.delete(bankId)
      );

      return data;
    },
    ...options,
  });
}
