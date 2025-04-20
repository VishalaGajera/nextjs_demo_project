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
import type { CompanyBankFormFieldValues } from "../CompanyBankForm";
import { BANK_ROUTES } from "../../../../../constants/routes/organization/bank/routes";

type EditCompanyBankApiResponse = ApiSuccessResponse<CompanyBank>;

type UseEditCompanyBankArgs = {
  options: UseMutationOptions<
    EditCompanyBankApiResponse,
    ApiErrorResponse<CompanyBankFormFieldValues>,
    Partial<CompanyBankFormFieldValues>
  >;
  companyBankId: string;
};

export function useEditCompanyBank({
  companyBankId,
  options = {},
}: UseEditCompanyBankArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyBankKeys.edit(companyBankId),
    mutationFn: async (formValues) => {
      const { data } = await axiosPrivate.patch<EditCompanyBankApiResponse>(
        BANK_ROUTES.patch(companyBankId),
        formValues
      );

      return data;
    },
    ...options,
  });
}
