"use client";

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { INVESTMENT_SCHEMES_ROUTES } from "../../../../../../../../constants/routes/payroll/settings/deductions/investment-deductions/investment-schemes/routes";
import { useAxiosPrivate } from "../../../../../../../../hooks/useAxiosPrivate";
import { investmentSchemesKeys } from "../../../../../../../../queryKeysFactories/investmentSchemes";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
} from "../../../../../../../../types/apiResponse";
import type { InvestmentSchemesRecord } from "../../InvestmentSchemesList/hooks/useGetInvestmentSchemesList";
import type { InvestmentSchemesFormFieldValues } from "../InvestmentSchemesForm";

type AddInvestmentSchemesApiSuccessResponse =
  ApiSuccessResponse<InvestmentSchemesRecord>;

type UseAddInvestmentSchemesArgs = {
  options: UseMutationOptions<
    AddInvestmentSchemesApiSuccessResponse,
    ApiErrorResponse<InvestmentSchemesFormFieldValues>,
    Partial<InvestmentSchemesFormFieldValues>
  >;
};

export function useAddInvestmentSchemes({
  options = {},
}: UseAddInvestmentSchemesArgs) {
  const { axiosPrivate } = useAxiosPrivate();

  return useMutation({
    mutationKey: investmentSchemesKeys.add(),
    mutationFn: async (formValues) => {
      const { data } =
        await axiosPrivate.post<AddInvestmentSchemesApiSuccessResponse>(
          INVESTMENT_SCHEMES_ROUTES.post,
          formValues
        );

      return data;
    },
    ...options,
  });
}
