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

type AddCompanyBanksApiSuccessResponse = ApiSuccessResponse<CompanyBank>;

type UseAddCompanyBanksArgs = {
  options: UseMutationOptions<
    AddCompanyBanksApiSuccessResponse,
    ApiErrorResponse<CompanyBankFormFieldValues>,
    Partial<CompanyBankFormFieldValues>
  >;
};

export function useAddCompanyBank({ options = {} }: UseAddCompanyBanksArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: companyBankKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddCompanyBanksApiSuccessResponse>(
          BANK_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
