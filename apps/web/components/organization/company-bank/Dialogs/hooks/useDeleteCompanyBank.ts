"use client";

import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { useAxiosPrivate } from "../../../../../hooks/useAxiosPrivate";
import { companyBankKeys } from "../../../../../queryKeysFactories/companyBanks";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../types/apiResponse";
import type { CompanyBank } from "../../CompanyBankList/hooks/useGetCompanyBanks";
import { BANK_ROUTES } from "../../../../../constants/routes/organization/bank/routes";

type DeleteCompanyBankApiResponse = ApiSuccessResponse<CompanyBank>;

type UseDeleteCompanyBankArgs = {
  options: UseMutationOptions<DeleteCompanyBankApiResponse, ApiErrorResponse>;
  companyBankId: string;
};

export function useDeleteCompanyBank({
  companyBankId,
  options = {},
}: UseDeleteCompanyBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyBankKeys.delete(companyBankId),
    mutationFn: async () => {
      const { data } = await axiosPrivate.delete<DeleteCompanyBankApiResponse>(
        BANK_ROUTES.delete(companyBankId)
      );

      return data;
    },
    ...options,
  });
}
